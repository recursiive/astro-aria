---
layout: ../../layouts/post.astro
title: Homelab Setup & Progress
description: A in-depth writeup of setting up my homelab.
dateFormatted: Oct 22, 2025
topic: ["Homelab", "Active Directory"]
technologies: ["Proxmox", "Linux", "Windows"]
tags: ["Homelab", "Infrastructure", "Virtualization", "Docker"]
hidden: false
---

Super stoked to finally get my hands on some hardware to get my homelab up and running.

My overall goal for this homelab is to have a domain supporting 1-2 user machines, with security logs forwarding to an open-source SIEM like [Security Onion](https://securityonionsolutions.com/) and configure the ELK stack (Elastic, Logstash, Kibana).

Using a Kali virtual machine attack and exploit vulnerabilities present on the user machines.

There is so much oppourtunity for learning and messing around with different tools and hardware to expand this homelab, so I am excited to get started.



### Covered in this post
- [x] Set up Proxmox hypervisor
- [x] Set up Docker instance running Debian 13 for Teslamate Web Server using Proxmox hypervisor
- [x] Setup `hunt.local` domain through Windows Server 2022
- [x] Setup domain joined Windows 10 workstation
- [ ] Caffeine Intake 

![setup](https://i.imgur.com/Qd6Sii9.png)

### Current Hardware
- Optiplex 3050
- Fortinet Fortigate 60D Firewall
- Netgear Nighthawk Router


### Proxmox VE Install

Through Rufus, I flashed [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) onto a USB and installed it on the Optiplex 3050, and installed docker on the machine.


### Setting up Windows Server 2022 as my Domain Controller


After downloading the Windows Server 2022 .iso file from Microsoft, I uploaded it to my main node in Proxmox and then created a new VM with the following configurations:

![DC-config](https://i.imgur.com/PottE2d.png)

Through the Control Panel and IPv4 network properties, I configured a static IP for my domain controller.

![static](https://i.imgur.com/huVHzvG.png)

I also renamed the computer to the common Domain Controller naming convention (XXXX-SAN-DC01).

### Promoting to Domain Controller

Promoting to Domain Controller ran me through me through the configuration of AD, allowing me to install additional features such as DHCP, DNS Servers, and set up my domain name.

### Installing Domain-Joined Windows 10 VM

![win10](https://i.imgur.com/FA9cUwS.png)

Installing the Windows 10 VM in Proxmox under my main node was pretty straightforward, loading the Windows10.iso into storage and adding an additional CD/DVD drive for VirtIO drivers. 

Now that this virtual machine is up and running, it needs to be joined the `hunt.local` domain.

In order to do so, I need to point ```XXXX-LABVM-XXX```'s DNS settings to the Domain Controller IP, so through Control Panel -> Network and Internet -> Network and Sharing Center -> Change Adapter Settings -> then right click properties on Ethrenet -> IPv4 Properties. 

![ipv4](https://i.imgur.com/NPiW6yz.png)

Pointing the `Preferred DNS Server: 10.0.0.XXX` to the DC's IP.

Once the DNS and static IP was configured, I added the workstation to Active Directory via `sysdm.cpl` -> Change Computer Name, and entered the desired workstation name and domain name.

After a reboot of the workstation, the workstation appeared in my Active Directory workstation tree, and navigating to users, I can begin creating domain users. I created two users `user` and `admin`.

![DOMAIN](https://i.imgur.com/uy3QFzF.png)

*I think its fair to note in this process, I forgot my root password for Promox and had to find out how to reset root password through the boot parameters.* 🥲

------------------------------------------------

### Deploying a Debian Instance for [Teslamate](https://github.com/teslamate-org/teslamate)

Shifting out of the Windows environment, and to give a little bit of background on [Teslamate](https://github.com/teslamate-org/teslamate), I've always wanted to set up Teslamate, but never felt like running it on my main computer since it needs to be running 24/7/365 to collect data. Teslamate is a self-hosted data logger for Tesla vehicles, and provides metrics and insights into drive efficiency, overview, trips, battery health, etc. Every metric into the car you could think of, is more than likely readily available through Teslamate in a nice dashboard view. Since I was able to set up a server intended to be running 24/7, this was the perfect oppourtunity to set this up.


Under my proxmox domain, I deployed a Debian 13 VM and began the [Teslamate](https://github.com/teslamate-org/teslamate) install process which was setting up the docker .yml file for two web services on port 3000 and 4000 for teslamate. 

```yml
services:
  teslamate:
    image: teslamate/teslamate:latest
    restart: always
    environment:
      - ENCRYPTION_KEY=secretkey #replace with a secure key to encrypt your Tesla API tokens
      - DATABASE_USER=teslamate
      - DATABASE_PASS=password #insert your secure database password!
      - DATABASE_NAME=teslamate
      - DATABASE_HOST=database
      - MQTT_HOST=mosquitto
    ports:
      - 4000:4000
    volumes:
      - ./import:/opt/app/import
    cap_drop:
      - all

  database:
    image: postgres:17-trixie
    restart: always
    environment:
      - POSTGRES_USER=teslamate
      - POSTGRES_PASSWORD=password #insert your secure database password!
      - POSTGRES_DB=teslamate
    volumes:
      - teslamate-db:/var/lib/postgresql/data

  grafana:
    image: teslamate/grafana:latest
    restart: always
    environment:
      - DATABASE_USER=teslamate
      - DATABASE_PASS=password #insert your secure database password!
      - DATABASE_NAME=teslamate
      - DATABASE_HOST=database
    ports:
      - 3000:3000
    volumes:
      - teslamate-grafana-data:/var/lib/grafana

  mosquitto:
    image: eclipse-mosquitto:2
    restart: always
    command: mosquitto -c /mosquitto-no-auth.conf
    # ports:
    #   - 1883:1883
    volumes:
      - mosquitto-conf:/mosquitto/config
      - mosquitto-data:/mosquitto/data

volumes:
  teslamate-db:
  teslamate-grafana-data:
  mosquitto-conf:
  mosquitto-data:
  ```

To configure the .yml, I set up a secure encryption key, as well as a secure database password to log the teslamate data. 

Heres a nice overview of Grafana logging the data for my Tesla.

![grafana](https://i.imgur.com/YWAinJV.png)

In order to ensure that this teslamate service is always configured to run at boot, I created a startup file at `/etc/systemd/system/` to bring the docker service up on boot.

```bash
[Unit]
Description=TeslaMate Docker Compose Stack
After=network-online.target docker.service
Requires=docker.service
Wants=network-online.target

[Service]
Type=oneshot
User=teslamate
WorkingDirectory=/opt/teslamate
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
RemainAfterExit=yes
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

After rebooting, I confirmed it starts the web servers on boot.

### Current Load

![overview](https://i.imgur.com/LfAads4.png)

Currently, were looking tight on resources with 3 VM's running, I will definitely need to upgrade the Optiplex 3050 or look at some different machines for host usage.

### Next Steps
- [ ] Implement Wazuh & ELK Stack for Open-Source SIEM & XDR.
- [ ] Configure Fortinet Fortigate 60D firewall.
- [ ] Research proxying & file servers

At the current time, I'm under a standstill, I'm looking to get my hands on some more RAM to increase the memory for my Optiplex Micro 3050. Currently with 8GB, we can run 3VM's (2 of them being pretty heavy due to Windows).

Im thinking grabbing two 2x16GB (32GB) DDR4 SODIMM RAM, which should free up the RAM bottleneck.

I'm also considering adding another node, solely for the heavy Windows VM's (DC, W10), and having the 2nd node to deploy other services, which would require me to set up a [cluster](https://pve.proxmox.com/wiki/Cluster_Manager).

