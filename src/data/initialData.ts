import { PortfolioData } from '../types';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  hero: {
    name: "VarunShiswal_SEC",
    subtitle: "IT Professional | Cybersecurity Enthusiast",
    bio: "IT industry professional with practical experience across IT systems administration, network engineering, and security fundamentals. Dedicated to building resilient infrastructure, conducting systematic vulnerability assessments, and maintaining high-availability enterprise services.",
    highlights: [
      "Experience across IT support, network administration, and security fundamentals",
      "Actively building hands-on security projects and virtualized lab environments",
      "Proficient in vulnerability scanning, packet analysis, and system hardening",
      "Open to freelance, consulting, and collaborative IT security initiatives"
    ],
    availability: "Available for Projects & Full-time Roles",
    location: "Global / Remote",
    badgeText: "Enterprise IT & Security"
  },
  projects: [
    {
      id: "p1",
      title: "Automated Enterprise Vulnerability Scanner",
      category: "completed",
      description: "Automated network reconnaissance and port scanning script with CVE correlation, risk scoring, and HTML/JSON report generation for rapid audit cycles.",
      longDescription: "Developed a Python-based security assessment framework that orchestrates Nmap discovery scans, queries national vulnerability databases (NVD API) for known CVEs, and generates executive summaries as well as technical remediation guides for sysadmins.",
      techStack: ["Python", "Nmap", "Bash", "CVE Database", "Docker"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: true,
      date: "2025",
      metrics: "Reduced scan triage time by 65%"
    },
    {
      id: "p2",
      title: "Hardened Multi-Tenant Virtualized Security Lab",
      category: "completed",
      description: "Enterprise simulation environment configured with Windows Active Directory Domain Services, Linux subnets, and customized firewall policies in VMware.",
      longDescription: "Architected a dual-segment lab running Windows Server 2022 domain controller with strict GPO baselines, segmented Linux workstations (Ubuntu/Debian), and pfSense firewall for testing secure access controls, DNS filtering, and user privilege models.",
      techStack: ["Windows Server", "VMware ESXi", "Linux", "Active Directory", "pfSense"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: true,
      date: "2025",
      metrics: "Simulates 50+ domain users & GPO baselines"
    },
    {
      id: "p3",
      title: "Wireshark Packet Analysis & Protocol Toolkit",
      category: "completed",
      description: "Custom packet inspection and stream extraction scripts for diagnosing network bottlenecks, DNS anomalies, and unencrypted credential exposure.",
      longDescription: "Authored specialized Python (Scapy/TShark) filters to dissect suspicious PCAP captures, identify anomalous ARP broadcast floods, verify TLS certificate handshakes, and isolate rogue DHCP offers across campus subnets.",
      techStack: ["Wireshark", "TShark", "Python", "Scapy", "TCP/IP"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: false,
      date: "2024",
      metrics: "Analyzed 10GB+ PCAP datasets"
    },
    {
      id: "p4",
      title: "Cloud Infrastructure Security & Compliance Auditing",
      category: "ongoing",
      description: "Framework assessing cloud assets against CIS benchmarks, checking IAM least-privilege configurations, and detecting unencrypted public storage buckets.",
      longDescription: "Developing modular audit scripts to scan cloud infrastructure for common misconfigurations: exposed SSH keys, overly permissive security groups, and unmanaged service accounts with automatic remediation suggestions.",
      techStack: ["Python", "Cloud Security", "Terraform", "IAM", "CIS Benchmarks"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: true,
      date: "2026 (In Progress)",
      metrics: "120+ Automated Compliance Rules"
    },
    {
      id: "p5",
      title: "Threat Intelligence Feed Aggregator & Alerting Engine",
      category: "ongoing",
      description: "Lightweight ingestion pipeline correlating real-time IP/domain blocklists with firewall logs to flag high-risk network traffic instantaneously.",
      longDescription: "Building a unified alert dashboard combining Open Source Threat Intelligence (OSINT) feeds with local syslog daemons for fast perimeter anomaly detection.",
      techStack: ["JavaScript", "Node.js", "Syslog", "REST APIs", "Docker"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: false,
      date: "2026 (Active)",
      metrics: "Real-time feed deduplication"
    },
    {
      id: "p6",
      title: "Open-Source SecOps Script Library",
      category: "contribution",
      description: "Contributed modular Bash and PowerShell maintenance scripts for automated patching, user auditing, and endpoint health monitoring.",
      longDescription: "Collaborated on an open community repository providing tested one-liners and administrative scripts used by junior sysadmins to verify firewall state, backup integrity, and SSH root login restrictions.",
      techStack: ["Bash", "PowerShell", "Linux", "Git", "GitHub Actions"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: true,
      date: "2025",
      metrics: "50+ community stars & shared tools"
    },
    {
      id: "p7",
      title: "Community IT Support & Security Playbooks",
      category: "contribution",
      description: "Co-authored standard operating procedure (SOP) documentation for incident triage, phishing report handling, and routine server backups.",
      longDescription: "Wrote structured checklists and step-by-step response flowcharts covering common IT helpdesk and Tier-1 security escalation scenarios.",
      techStack: ["Documentation", "ITIL Best Practices", "Incident Response", "Git"],
      projectUrl: "https://github.com/varun878",
      githubUrl: "https://github.com/varun878",
      featured: false,
      date: "2024",
      metrics: "Adopted by student & junior tech groups"
    }
  ],
  skills: [
    {
      id: "s1",
      title: "Languages",
      description: "Scripting, automation, and programming languages for system tasks",
      skills: ["Python", "Bash / Shell", "JavaScript", "PowerShell", "SQL (PostgreSQL / MySQL)"]
    },
    {
      id: "s2",
      title: "Tools & Platforms",
      description: "Enterprise security assessment, virtualization, and diagnostic tooling",
      skills: ["Wireshark", "Burp Suite", "Nmap", "VMware ESXi / Workstation", "Nessus", "Docker", "Git / GitHub", "pfSense / Firewall"]
    },
    {
      id: "s3",
      title: "Operating Systems",
      description: "Server and desktop administration across diverse environments",
      skills: ["Windows Server (2019/2022)", "Windows 10/11 Enterprise", "Linux (Ubuntu / Debian)", "Kali Linux", "RHEL / Rocky Linux"]
    },
    {
      id: "s4",
      title: "IT & Security Concepts",
      description: "Core networking, infrastructure design, and defensive concepts",
      skills: [
        "Networking (TCP/IP, DNS, DHCP, VLANs)",
        "System Administration",
        "Vulnerability Assessment",
        "IT Support & Troubleshooting",
        "Active Directory & Group Policy",
        "Access Control (RBAC & IAM)",
        "Incident Triage & Logging"
      ]
    }
  ],
  blog: [
    {
      id: "b1",
      title: "Practical Vulnerability Assessment: From Initial Discovery to Hardening",
      slug: "practical-vulnerability-assessment-guide",
      date: "August 18, 2026",
      readTime: "6 min read",
      tags: ["Vulnerability Assessment", "Nmap", "System Hardening", "IT Security"],
      excerpt: "A structured walkthrough on conducting baseline network scans, prioritizing critical vulnerabilities, and implementing concrete remediation steps without breaking production services.",
      content: `### Introduction

Regular vulnerability assessments are the cornerstone of any proactive defense strategy. Rather than waiting for an alert or incident, routine audits help identify unpatched services, misconfigured ports, and outdated cryptographic protocols before they can be leveraged against your infrastructure.

In this guide, we'll examine a standard four-step workflow:
1. **Network Discovery & Asset Tagging**
2. **Service & Version Fingerprinting**
3. **Risk Scoring & CVE Triage**
4. **Remediation & Verification**

---

### 1. Asset Discovery with Nmap

Before assessing security posture, you must accurately catalog what is running on your network. A non-intrusive SYN scan is typically the first step:

\`\`\`bash
# Fast discovery scan across the local subnet
nmap -sn 192.168.1.0/24 -oN discovery_hosts.txt

# Targeted service scan on identified endpoints
nmap -sS -sV -O -p- --min-rate 1000 192.168.1.50 -oX target_audit.xml
\`\`\`

**Key considerations:**
- Always ensure you have written authorization and perform scans within maintenance windows.
- Monitor network appliances to verify that IDS/IPS sensors log the scanning activity accurately.

---

### 2. Prioritizing Findings Using Common Vulnerability Scoring (CVSS)

Not all findings require immediate emergency maintenance. Triage based on **exploitability** and **asset criticality**:
- **Critical (CVSS 9.0 - 10.0):** Remote code execution with public exploits available (e.g., unauthenticated RCE on edge routers).
- **High (CVSS 7.0 - 8.9):** Privilege escalation or weak credential policies on internal subnets.
- **Medium / Low:** Informational banners, legacy cipher suites, or non-sensitive info disclosure.

---

### 3. Practical Hardening Checklist

1. **Disable Legacy Protocols:** Turn off SMBv1, SSLv3, and TLS 1.0/1.1 across all web and domain services.
2. **Implement Principle of Least Privilege:** Verify that service accounts do not possess domain admin privileges.
3. **Automate Patch Verification:** Re-scan immediately after patching to validate that version banners reflect the updated build.

Regular assessments turn security from a reactive burden into an organized, repeatable engineering discipline.`
    },
    {
      id: "b2",
      title: "Hardening Enterprise Active Directory: Essential Group Policy Controls",
      slug: "hardening-active-directory-gpo",
      date: "July 29, 2026",
      readTime: "5 min read",
      tags: ["Active Directory", "Windows Server", "Group Policy", "SysAdmin"],
      excerpt: "Key Group Policy configurations that dramatically reduce attack surfaces across Windows domains, including LAPS, Kerberos armoring, and PowerShell audit logging.",
      content: `### Securing the Identity Core

Active Directory remains the backbone of enterprise authentication. Misconfigurations in default domain policies can inadvertently leave paths open for lateral movement.

Here are four essential configurations every administrator should enforce:

---

### 1. Windows Local Administrator Password Solution (LAPS)
Standardizing identical local admin passwords across workstations is a frequent vulnerability.
- Deploy **Windows LAPS** to randomize and rotate local administrator passwords automatically.
- Store passwords in encrypted AD attributes accessible only by authorized Tier-2 sysadmins.

---

### 2. Script Block & Module Logging for PowerShell
Visibility into administrative command execution is critical for auditing and troubleshooting:
\`\`\`powershell
# GPO Path: Computer Configuration -> Administrative Templates -> Windows Components -> Windows PowerShell
# Enable:
- "Turn on PowerShell Script Block Logging"
- "Turn on Module Logging"
- "Turn on Transcription"
\`\`\`

---

### 3. Disabling NTLM Fallback
Where feasible, enforce Kerberos authentication and restrict NTLM traffic:
- Set \`Network security: Restrict NTLM: Incoming NTLM traffic\` to **Require audit or block**.
- Enforce SMB signing on all domain controllers and file servers.

Implementing these controls elevates the baseline security posture across the entire domain without introducing user friction.`
    },
    {
      id: "b3",
      title: "Analyzing Suspicious Traffic with Wireshark: A Systematic Approach",
      slug: "analyzing-suspicious-traffic-wireshark",
      date: "June 14, 2026",
      readTime: "7 min read",
      tags: ["Wireshark", "Networking", "Packet Analysis", "Troubleshooting"],
      excerpt: "How to filter through massive PCAP captures, identify abnormal DNS queries, detect cleartext protocol usage, and isolate network bottlenecks.",
      content: `### The Power of Packet Dissection

When application logs don't provide the complete story, raw packet captures never lie. Wireshark is an indispensable tool for diagnosing both network performance bottlenecks and security anomalies.

---

### Essential Display Filters

Here are the most useful Wireshark filters for triage:

\`\`\`text
# 1. Isolate DNS requests and responses
dns.flags.response == 0 and dns.qry.name contains "corp"

# 2. Find cleartext HTTP credentials and forms
http.request.method == "POST" and (http contains "password" or http contains "user")

# 3. Detect TCP Resets and connection teardowns
tcp.flags.reset == 1 and tcp.analysis.flags

# 4. Spot anomalous ARP traffic / ARP spoofing patterns
arp.duplicate-address-frame or arp.opcode == 2
\`\`\`

---

### Best Practices for Capture Management
1. **Use Capture Filters Early:** Apply BPF filters (e.g. \`net 10.0.0.0/16 and not port 22\`) to prevent memory exhaustion during long capture sessions.
2. **Examine Conversation Statistics:** Navigate to *Statistics -> Conversations -> IPv4* to quickly spot endpoints generating disproportionate volume.
3. **Follow TCP Streams:** Right-click suspicious packets and select *Follow -> TCP Stream* to inspect reconstructed payload dialogues.`
    }
  ],
  gallery: [
    {
      id: "g1",
      type: "image",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      title: "Enterprise Server Rack & Switching Infrastructure",
      caption: "Configuring redundant VLAN trunks and core aggregation switches in a high-availability server environment.",
      date: "2026"
    },
    {
      id: "g2",
      type: "image",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      title: "Network Security & Protocol Analysis Station",
      caption: "Multi-monitor workspace configured for packet capture analysis, network monitoring, and virtualized lab testing.",
      date: "2026"
    },
    {
      id: "g3",
      type: "image",
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      title: "Vulnerability Scanning & CVE Audit Lab",
      caption: "Executing automated security assessments and verifying patch baselines against standard test environments.",
      date: "2025"
    },
    {
      id: "g4",
      type: "image",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      title: "Automation & Scripting Development",
      caption: "Authoring Python and Bash diagnostic scripts for automated host triage and system hardening.",
      date: "2025"
    },
    {
      id: "g5",
      type: "image",
      url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      title: "Patch Management & High-Density Cabling",
      caption: "Structured cabling organization and hardware maintenance across enterprise distribution racks.",
      date: "2025"
    },
    {
      id: "g6",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-server-room-with-blinking-lights-42526-large.mp4",
      title: "Live Datacenter Server Diagnostics (Video)",
      caption: "Live telemetry and status monitoring of virtual machine clusters in active operation.",
      date: "2026",
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
    }
  ],
  contact: {
    github: "https://github.com/varun878",
    linkedin: "https://www.linkedin.com/in/varun-kumar-435a77298",
    email: "varunshiswal@gmail.com",
    instagram: "https://www.instagram.com/varunkumar.sec/",
    location: "India / Available Globally",
    phone: ""
  }
};
