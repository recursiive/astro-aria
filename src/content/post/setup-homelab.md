---
layout: ../../layouts/post.astro
title: Homelab Setup & Progress
description: A in-depth writeup of setting up my homelab.
dateFormatted: Oct 22, 2025
topic: ["Homelab", "Active Directory"]
technologies: ["Proxmox", "Linux", "Windows"]
---

Super stoked to finally get my hands on some hardware to get my homelab up and running.

### Current Plans
- [x] Set up Proxmox on main server `huntproxprd1`
- [x] Set up Docker instance running Debian 13 for Teslamate Web Server
- [ ] Setup `hunt.local` domain through Windows Server 2022
- [ ] Setup domain joined deprecated Windows 10 vulnerable machine to be attackable

![setup](https://i.imgur.com/6NT67qx.png)

### Current Hardware
- Optiplex 3050
- Fortinet Fortigate 60D Firewall
- Netgear Nighthawk Router

### Proxmox VE Install

Through Rufus, I flashed [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) onto a USB and installed it on the Optiplex 3050, and installed docker on the machine. 

### Deploying a Debian Instance for Teslamate

![iso](https://i.imgur.com/2bn3FMf.png)

Since buying my Tesla, I've always wanted to set up Teslamate to get insights into my vehicles health, efficency and data that is not normally available through the Tesla app. However, I did not feel like running my personal computer 24/7/365. Since I was able to obtain hardware for my homelab, I felt this would be the perfect time to configure Teslamate.

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

### Setting up Windows Server 2022 as my Domain Controller

After downloading the Windows Server 2022 .iso file from Microsoft, I uploaded it to my main node in Proxmox and then created a new VM with the following configurations:

![DC-config](https://i.imgur.com/R1NgOOo.png)

Through the Control Panel and IPv4 network properties, I configured a static IP for my domain controller.

![static](https://i.imgur.com/huVHzvG.png)

I also renamed the computer to the common Domain Controller naming convention (XXXX-SAN-DC01).

### Promoting to Domain Controller

Promoting to Domain Controller ran me through me through the configuration of AD, allowing me to install additional features such as DHCP, DNS Servers, and set up my domain name.




### Installing Domain-Joined Windows 10 VM

Installing the Windows 10 VM in Proxmox under my main node was pretty straightforward, loading the Windows10.iso into storage and adding an additional CD/DVD drive for VirtIO drivers.

![win10](https://i.imgur.com/Qqm4Psa.png)


