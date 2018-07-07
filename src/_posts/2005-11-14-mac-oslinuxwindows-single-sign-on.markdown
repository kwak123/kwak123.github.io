---
author: Nate Chandler
date: 2005-11-14 16:29:55+00:00
excerpt: Centralized authentication greatly simplifies network administration.  This
  post teaches how to log in to a Mac or Linux computer using centrally managed user
  accounts from a Windows Active Directory domain controller.  With this configuration,
  the same Windows user accounts can be used to log in to any of the three operating
  systems, Mac OS, Linux, or Windows, with the same user network folder auto-mounted.
layout: post
path: /blog/single-sign-on
title: Mac OS/Linux/Windows Single Sign-On
wordpress_id: 6
---

Centralized authentication greatly simplifies network administration.  This post teaches how to log in to a Mac or Linux computer using centrally managed user accounts from a Windows Active Directory domain controller.  With this configuration, the same Windows user accounts can be used to log in to any of the three operating systems, Mac OS, Linux, or Windows, with the same user network folder auto-mounted.



<!-- more -->


_**Requirements**_
Mac OS X 10.3 or newer, with all updates installed.
SAMBA 3.x on Linux (this example uses Fedora Core 4, but the steps should apply to other distributions as well).
Windows Domain Controller, running Server 2000 or newer.





**_Abstract_**
On Windows:
Configure the user network home folder path.  Redirect the My Documents folder to the same network path (optional).  Configure Kerberos to allow unencrypted connections  (additional notes as to why this setup is used are at the end of the post).





On Linux:
Configure Kerberos, SAMBA, and Winbind with the domain settings.  Join the domain.  Configure NSS and PAM for AD authentication.  Set PAM to autocreate local user home folders and auto-mount the network user folder specified in Active Directory.   Log in as a domain user to test the configuration.





On OSX:
Configure Active Directory access using the Directory Access utility.  Join the domain.  Add the Active Directory domain to the Authentication and Contacts search paths.  Change login preferences to prompt for username and password.  Log in as a domain user to test the configuration.





**_Detailed Steps_**
We'll handle each of the OS's in order.  First, Windows:
_The steps below assume a domain named bnr.com in an IP range of 192.168.1.x with a domain user account called student and a domain controller named win-svr1.  Adjust these values to match your own setup._





**_Windows_**
**Configure the network folder that clients will automount:**
1. Specify the user's home folder path on the Profile tab of the user account properties in Active Directory Users and Computers. This is the path that each OS will connect to on login as this user. The parent folder (in this case \\win-svr1\home) is the UNC path of a pre-existing shared folder on a Windows server. The subfolder for this user (\\win-svr1\home\student) is created automatically:


![Specify user home folder path](images/HomeFolderPath.jpg)



**Redirect the My Documents folder to the same network folder:**
This is optional, but it's a nice bonus having the My Documents files available from the other computers.
1. In the Default Domain Policy \ User Configuration \ Windows Settings \ Folder Redirection \ My Documents, choose the Basic setting and specify a file server share path.  All users' My Documents folders will be redirected here:


![My Documents redirection](images/RedirectMyDocs.jpg)



**Configure security settings to allow SMB connections:**
1. Allow unencrypted connections in the Default Domain Controller and Default Domain Group Policies:
In the Default Domain Controller Policy \ Computer Configuration \ Windows Settings \ Security Settings \ Local Policies \ Security Options, find "Microsoft network server: Digitally sign communications (always)" and "Microsoft network server: Digitally sign communications (if client agrees)".  Define both of these policies as "Disabled":


![SMB Group Policy changes](images/SMBSigningDisabled.jpg)



2. Make the same change under the Default Domain Policy.





**Apply the updated group policy changes:**
1. Run gpupdate on the server from a command line to refresh group policy settings:


    c:\><strong>gpupdate</strong>
    Refreshing Policy...

    User Policy Refresh has completed.
    Computer Policy Refresh has completed.





Now, on to Linux:





**_Linux_**
**Configure local NTP time source to avoid Kerberos time conflicts:**
1. Add a local ntp server to the ntpservers file


    $ <strong>sudo vi /etc/ntp/ntpservers</strong>
    <strong>192.168.1.10</strong>
    clock.redhat.com
    clock2.redhat.com





**Specify a DNS server for local name resolution:**
1. Add a local DNS server to /etc/resolv.conf:


    $ <strong>sudo vi /etc/resolv.conf</strong>
    <strong>search bnr.com</strong>
    <strong>nameserver 192.168.1.10</strong>





**Configure Kerberos:**
1. Edit krb5.conf


    $ <strong>sudo vi /etc/krb5.conf</strong>
    [logging]
     default = FILE:/var/log/krb5libs.log
     kdc = FILE:/var/log/krb5kdc.log
     admin_server = FILE:/var/log/kadmind.log


    [libdefaults]
    <strong> default_realm = BNR.COM</strong>
     dns_lookup_realm = false
     dns_lookup_kdc = false
     ticket_lifetime = 24h
     forwardable = yes

    <strong>[realms]
     BNR.COM = {
      kdc = win-svr1.bnr.com:88
      admin_server = win-svr1.bnr.com:749
      default_domain = bnr.com
     }</strong>

    <strong>[domain_realm]
     .bnr.com = BNR.COM
     bnr.com = BNR.COM</strong>

    [kdc]
     profile = /var/kerberos/krb5kdc/kdc.conf

    [appdefaults]
     pam = {
       debug = false
       ticket_lifetime = 36000
       renew_lifetime = 36000
       forwardable = true
       krb4_convert = false
     }






2. Test Kerberos by requesting a TGT (any domain account will work, but domain here is case-sensitive):


    $ <strong>kinit student@BNR.COM</strong>
    Password for student@BNR.COM:





3. Check if ticket request was valid by listing active Kerberos tickets:


    $ <strong>klist</strong>
    Ticket cache: FILE:/tmp/krb5cc_500
    Default principal: student@BNR.COM

    Valid starting     Expires            Service principal
    09/30/05 12:37:36  09/30/05 22:37:39  krbtgt/BNR.COM@BNR.COM
            renew until 10/01/05 12:37:36



Read on for more Linux configuration steps


**Configure Samba for domain access:**
1. Edit smb.conf


    $ <strong>sudo vi /etc/samba/smb.conf</strong>
    [global]

    # workgroup = NT-Domain-Name or Workgroup-Name
    #       workgroup = mygroup
    <strong>        workgroup = BNR</strong>
    ..
    # Security mode. Most people will want user level security. See
    # security_level.txt for details.
    #       security = domain
    <strong>        security = ads</strong>
    ..
    #============================ Share Definitions ============================
            idmap uid = 16777216-33554431
            idmap gid = 16777216-33554431
    #       template shell = /bin/false
            <strong>template shell = /bin/bash</strong>
            winbind use default domain = no
    <strong>#       username map = /etc/samba/smbusers</strong>
    <strong>        password server = win-svr1
    	realm = BNR.COM</strong>





2. Start/restart Winbind:


    $ <strong>sudo /etc/init.d/winbind restart</strong>





**Join the AD Domain:**
1. First, clear the way:
Before joining the domain, make sure a computer account for this computer does not exist on the Domain Controller. The computer account is created automatically when joining the domain.   Also, if the /etc/samba/secrets.tdb file exists, rename it.  This file is created when joining the domain.





2. Next, use "net ads join" to add the computer to the domain:


    $ <strong>sudo net ads join -U administrator</strong>
    administrator's password:
    Using short domain name -- BNR
    Joined 'fed1' to realm 'BNR.COM'





3. Test the domain connection by listing all domain users:


    $ <strong>wbinfo -u</strong>
    BNR\administrator
    BNR\guest
    BNR\support_388945a0
    BNR\win-svr1$
    BNR\krbtgt
    BNR\mac1$
    BNR\student
    BNR\fed3$





4. List all domain groups:


    $ <strong>wbinfo -g</strong>
    BUILTIN\system operators
    BUILTIN\replicators
    BUILTIN\guests
    BUILTIN\power users
    BUILTIN\print operators
    BUILTIN\administrators
    BUILTIN\account operators
    BUILTIN\backup operators
    BUILTIN\users
    BNR\domain computers
    BNR\domain controllers
    BNR\schema admins
    BNR\enterprise admins
    BNR\domain admins
    BNR\domain users
    BNR\domain guests
    BNR\group policy creator owners
    BNR\dnsupdateproxy





**Configure NSS to use Winbind:**
1. Edit nsswitch.conf


    $ <strong>sudo vi /etc/nsswitch.conf</strong>
    ..
    #passwd:     files
    #shadow:     files
    #group:      files
    passwd:     files <strong>winbind</strong>
    shadow:     files <strong>winbind</strong>
    group:      files <strong>winbind</strong>
    ..
    ethers:     files
    netmasks:   files
    networks:   files
    #protocols:  files
    protocols:  files <strong>winbind</strong>
    rpc:        files
    #services:   files
    services:   files <strong>winbind</strong>

    #netgroup:   files
    netgroup:   files <strong>winbind</strong>
    publickey:  nisplus
    automount:  files
    aliases:    files nisplus





2. Test NSS Winbind connection by listing users from the passwd file with getent:


    $ <strong>getent passwd</strong>
    ..
    BNR\administrator:*:16777218:12777216:Administrator:/home/BNR/administrator:/bin/bash
    BNR\student:*:16777217:16777216:student:/home/BNR/student:/bin/bash
    ..





3. List groups using getent:


    $ <strong>getent group</strong>
    ..
    BNR\domain admins:x:16777219:BNR\administrator
    BNR\domain users:x:16777216:
    BNR\domain guests:x:16777217:
    ..





**Configure system-auth to use Winbind with PAM:**
1. First, backup your system-auth file:


    $ <strong>sudo cp /etc/pam.d/system-auth /etc/pam.d/system-auth.backup</strong>





2. Now, add the Winbind entries to the system-auth file:


    $ <strong>sudo vi /etc/pam.d/system-auth</strong>
    #%PAM-1.0
    # This file is auto-generated.
    # User changes will be destroyed the next time authconfig is run.
    auth        required      /lib/security/$ISA/pam_env.so
    auth        sufficient    /lib/security/$ISA/pam_unix.so likeauth nullok
    <strong>auth        sufficient    /lib/security/$ISA/pam_winbind.so use_first_pass</strong>
    auth        required      /lib/security/$ISA/pam_deny.so

    account     required      /lib/security/$ISA/pam_unix.so <strong>broken_shadow</strong>
    <strong>account     sufficient    /lib/security/$ISA/pam_localuser.so</strong>
    account     sufficient    /lib/security/$ISA/pam_succeed_if.so uid < 100 quiet
    <strong>account     [default=bad success=ok user_unknown=ignore] /lib/security/$ISA/pam_winbind.so</strong>
    account     required      /lib/security/$ISA/pam_permit.so

    password    requisite     /lib/security/$ISA/pam_cracklib.so retry=3
    password    sufficient    /lib/security/$ISA/pam_unix.so nullok use_authtok md5 shadow
    <strong>password    sufficient    /lib/security/$ISA/pam_winbind.so use_authtok</strong>
    password    required      /lib/security/$ISA/pam_deny.so

    session     required      /lib/security/$ISA/pam_limits.so
    session     required      /lib/security/$ISA/pam_unix.so





**Configure PAM to auto-create network home directories:**
1.  Add the pam_mkhomedir.so module.  If the home directory does not exist, it will be created on first login.


    $ <strong>sudo vi /etc/pam.d/login</strong>
    ..
    session    required     pam_selinux.so multiple open
    <strong>session    required     pam_mkhomedir.so skel=/etc/skel/ umask=0077</strong>





2. Add the pam_mkhomedir.so module to gdm.


    $ <strong>sudo vi /etc/pam.d/gdm</strong>
    ..
    session    optional     pam_console.so
    <strong>session    required     pam_mkhomedir.so skel=/etc/skel/ umask=0077</strong>





**Create a local directory for storing domain user profiles:**
1. All domain user local profiles (local home directories) will be auto-created under this folder:


    $ <strong>sudo mkdir /home/BNR </strong>





**Set the network folder to automount:**
1. Create a file that contains your domain login information (fill in your actual username and password):


    $ <strong>vi ~/.smbpass
    username = student
    password = mypassword
    </strong>





2. Set the file to readable only by root:


    $ <strong>sudo chmod 600 ~/.smbpass</strong>
    $<strong> sudo chown root ~/.smbpass</strong>





3. Create a directory to be used as the mount point:


    $ <strong>mkdir ~/nethome</strong>





4. Add an entry to fstab to mount the share on login (this is the last line of fstab, all on one line):


    $ <strong>sudo vi /etc/fstab
    //win-svr1/user /home/BNR/student/nethome smbfs    \
           credentials=/home/BNR/student/.smbpass,dmask=777,fmask=777 0 0</strong>





**Try it out:**
1. Restart and login using _domain\user_ username format.  In this example, the login name is bnr\student. On first successful domain user login, you will see a message that the user's local home folder is created, and the network folder is mounted:



![Home folder created on login](images/CreateHomeDir.png)



Read on for OS X Configuration





Finally, the OS X configuration:




**_OS X_**
**Configure DNS:**
1. In the TCP/IP configuration of your network device, add a DNS server and search domain for local DNS resolution:


![Local DNS configuration](images/MacDNSSettings.jpg)



**Configure Directory Access:**
1. Open Directory Access from Applications, Utilities. In the Services screen, highlight Active Directory and click Configure:


![Directory Access configuration](images/DirectoryAccess.jpg)



2. In the Active Directory configuration, enter the Domain name and computer name:


![Active Directory settings](images/ActiveDirectoryDomainName.jpg)



3. Under Advanced Options, User Experience, set home location to use SMB, and set default user shell:


![User Experience settings](images/ActiveDirectoryUserExperience.jpg)



4. Under the Administrative Advanced Options, allow administration by domain and enterprise admins, and allow authentication from any domain in the forest:


![Administrative Advanced options](images/ActiveDirectoryAdministrative.jpg)



**Join the AD Domain:**
1. Click Bind to join the Mac to the Windows Domain.  Enter username and password of a Windows user that has permission to join a computer to the domain.  Check options to use AD for authentication and contacts:


![Bind to Windows Domain](images/ActiveDirectoryBind.jpg)



2. Under Directory Access, Authentication, make sure Active Directory is in the search path:


![Authentication search path settings](images/ActiveDirectoryAuthentication.jpg)



3. Under Directory Access, Contacts, make sure Active Directory is in the search path:


![Contacts search path settings](images/ActiveDirectoryContacts.jpg)



4. Under Directory Access, Services, configure SMB/CIFS, adding the Workgroup name and WINS server address:


![SMB Workgroup and WINS settings](images/SMBWorkgroup.jpg)



**Configure login options:**
1. Launch System Preferences, Accounts.  Under Login Options, uncheck 'Automatically login', and choose 'Display login window as: Name and password'





**Try it out:**
1. Restart and login using _domain\user_ username format.  In this example, the login name is bnr\student. The user's network home folder will automount and appear as a folder on the dock:


![Network folder mounted](images/AutoMountMac.jpg)     ![Network folder on Dock](images/DockHomeFolder.jpg)



All done!





_**Final Notes**_




With the release of Service Pack 1 for Windows Server 2003, Windows domain controllers require encrypted communications by default.  While SAMBA 3.0 and Mac OS X 10.4 and newer also support encrypted SMB communications, this Windows server change has broken some SMB interoperability.  As a result of this change, the current workable solution is to disable Microsoft's digital signing of network communications as specified in the steps above.  Be warned that this configuration results in a less secure network.
