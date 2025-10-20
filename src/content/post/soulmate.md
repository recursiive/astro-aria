---
layout: ../../layouts/post.astro
title: Soulmate Write-Up
description: A comprehensive writeup of the HackTheBox Soulmate machine.
dateFormatted: Oct 19, 2025
topic: ["Red Team"]
technologies: ["Azure", "Sentinel"]
---
## Overview

TBDTBDTBD


## Reconnaissance

To confirm my VPN is connected correctly, and confirm the machine is reachable, I pinged the target machine IP address.

![ping](https://i.imgur.com/MqDxE2Z.png)

### Conducting initial recon through nmap to discover any open ports:

 `nmap -sV -p 1-65535 -T4 -A -v -Pn 10.10.11.86`

```bash
Nmap scan report for 10.10.11.86
Host is up (0.067s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp   open  http    nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://soulmate.htb/
```
### Findings
- Port 80 (HTTP)
- Port 22 (SSH)




