---
layout: ../../layouts/post.astro
title: Outbound - HackTheBox "Easy"
description: A in-depth writeup of the HackTheBox Outbound machine.
dateFormatted: Nov 14, 2025
topic: ["HackTheBox", "Attack"]
technologies: ["HackTheBox", "Linux"]
tags: ["HackTheBox"]
hidden: yes
---

## Overview

### Credentials Provided

Username: tyler

Password: LhKL1o9Nm3X2

## Recon

My initial scan identified two open ports, `22` and `80`.

### nmap scan

```
──(assess㉿kali)-[~/ctf/htb/outbound]
└─$ nmap -sV -p 1-65535 -T4 -A -v -Pn -oN scan.txt 10.10.11.77
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-14 00:42 EST
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.12 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 0c:4b:d2:76:ab:10:06:92:05:dc:f7:55:94:7f:18:df (ECDSA)
|_  256 2d:6d:4a:4c:ee:2e:11:b6:c8:90:e6:83:e9:df:38:b0 (ED25519)
80/tcp open  http    nginx 1.24.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://mail.outbound.htb/
|_http-server-header: nginx/1.24.0 (Ubuntu)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Nmap done: 1 IP address (1 host up) scanned in 25.45 seconds
           Raw packets sent: 65567 (2.886MB) | Rcvd: 65560 (2.623MB)

```

### Web Enumeration

Adding `mail.outbound.htb` to `/etc/hosts` to visit the web page via browser.

![webmail](https://i.vgy.me/cJf5N6.png)

The webserver is running [Roundcube](https://roundcube.net/) Webmail 1.6.10, which is is a browser-based multilingual IMAP client with an application-like user interface. It provides full functionality you expect from an email client, including MIME support, address book, folder manipulation, message searching and spell checking.

![version-img](https://i.vgy.me/Dk4KNI.png) 

### Vulnerability Research && PoC

Roundcube Webmail before `1.5.10 and 1.6.x before 1.6.11` allows remote code execution by authenticated users because the _from parameter in a URL is not validated in `program/actions/settings/upload.php`, leading to PHP Object Deserialization.

This vulnerability is tagged as CVE-2025-49113, with a publicly available [PoC](https://github.com/hakaioffsec/CVE-2025-49113-exploit) showccases an exploit targeting a deseralization vulnerability in RoundCube Webmail 1.5.0 - 1.6.10. This vulnerability allows an authenticated attacker to achieve remote code execution on the server.

### PoC Exploit

`CVE-2025-49113.php` works by checking if the web server is running a vulnerable version of Roundcube, and if vulnerable, proceeds to the authentication process. After successful authentication, it sends a generic PNG image to the server, at the point of upload it performs two injections (PHP session injection through` _form` param, and a malicious object injection allows for RCE on the server. ) ***requires valid credentials and vulnerable version running on server.***

