// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'jajera', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/jajera/jajera.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/jajera/portfolio, then set base to '/portfolio/'.
   */
  base: '/gitprofile/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'manual', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['jajera/my-project1', 'jajera/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: [
          // 'jajera/devcontainer-dind-template',
          // 'jajera/devcontainer-go-template',
          // 'jajera/devcontainer-java-template',
          // 'jajera/devcontainer-nodejs-template',
          // 'jajera/devcontainer-podman-template',
          // 'jajera/devcontainer-python-template',
          // 'jajera/devcontainer-ruby-template',
          // 'jajera/devcontainer-rust-template',
          // 'jajera/geonet-http-volcano-demo',
          // 'jajera/geonet-s3-volcano-demo',
          'jajera/inspec_os_rhel8_cis',
          'jajera/inspec_os_win2016_ms_cis',
          // 'jajera/mkdocs',
          'jajera/pwsh-dp_connectivity',
          'jajera/pwsh-service_status',
          'jajera/pwsh-win2008R2_baseline_cis',
          'jajera/rust-actix-web',
          'jajera/tf-aws-web-notes',
          'terraform-tfe-workspace-notification',
          'tfelab/terraform-tfe-org',
          'tfelab/terraform-tfe-registry',
          'tfelab/terraform-tfe-teams',
          'tfstack/terraform-aws-security-group',
          'tfstack/terraform-provider-slack',
        ], // List of repository names to display. example: ['jajera/my-project1', 'jajera/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Geonet Camera Demo - HTTP',
          description:
            'Live volcano camera demo hosted on GitHub Pages, showcasing data scrapped from HTTP.',
          imageUrl:
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://jajera.github.io/geonet-http-volcano-demo/',
        },
        {
          title: 'Geonet Camera Demo - S3',
          description:
            'Live volcano camera demo hosted on GitHub Pages, showcasing data scrapped from S3.',
          imageUrl:
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://jajera.github.io/geonet-s3-volcano-demo/',
        },
        {
          title: 'Wiki Notes',
          description: 'My personal wiki notes on an mkdocs implementation.',
          imageUrl:
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'jajera.github.io/mkdocs/',
        },
      ],
    },
  },
  seo: {
    title: 'Portfolio of John Ajera',
    description: '',
    imageURL: '',
  },
  social: {
    linkedin: 'john-ajera',
    twitter: '',
    mastodon: 'jajera@mastodon.social',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: 'https://dev.to/jajera',
    stackoverflow: '', // example: '1/jeff-atwood'
    skype: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'jdcajera@gmail.com',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Active Directory',
    'Ansible',
    'Atlassian',
    'AWS',
    'Azure',
    'Chef',
    'CyberArk',
    'Datadog',
    'Docker',
    'ECS',
    'GitHub',
    'GitLab',
    'Go',
    'Podman',
    'PowerShell',
    'Puppet',
    'Python',
    'RDS',
    'RedHat',
    'Ruby',
    'Rust',
    'SCCM',
    'Shell',
    'SQL',
    'Terraform',
    'VMWare',
    'Windows Server',
  ],
  experiences: [
    {
      company: 'GNS Science, New Zealand',
      position: 'Platform Engineer',
      from: 'July 2023',
      to: 'Present',
      companyLink: 'https://www.gns.cri.nz/',
    },
    {
      company: 'NCS PTE LTD, Singapore',
      position: 'Senior DevOps Engineer',
      from: 'Oct 2021',
      to: 'May 2023',
      companyLink: 'https://www.ncs.co/',
    },
    {
      company: 'United Overseas Bank Limited, Singapore',
      position: 'Cloud Automation Engineer',
      from: 'Oct 2020',
      to: 'Oct 2021',
      companyLink: 'https://www.ncs.co/',
    },
    {
      company: 'NCS PTE LTD, Singapore',
      position: 'Automation Engineer',
      from: 'Jan 2018',
      to: 'Sep 2020',
      companyLink: 'https://www.ncs.co/',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified SysOps Administrator - Associate',
      year: 'December 2024',
    },
    {
      name: 'GitLab Certified Project Management Associate',
      year: 'March 2023',
    },
    {
      name: 'GitLab Certified Git Associate',
      year: 'March 2023',
    },
    {
      name: 'Gitlab Certified CI/CD Associate',
      year: 'February 2023',
    },
    {
      name: 'Red Hat Delivery Specialist Automation II',
      year: 'March 2022',
    },
    {
      name: 'Red Hat Delivery Specialist Automation',
      year: 'March 2022',
    },
    {
      name: 'AWS Certified: Cloud Practitioner',
      year: 'March 2022',
    },
    {
      name: 'HashiCorp Certified: Vault Associate (002)',
      year: 'March 2022',
    },
    {
      name: 'Microsoft Certified: Azure Security Engineer Associate',
      year: 'March 2022',
    },
    {
      name: 'Microsoft Certified: Azure AI Fundamentals',
      year: 'March 2022',
    },
    {
      name: 'Microsoft Certified: Azure Administrator Associate',
      year: 'March 2022',
    },
    {
      name: 'Microsoft Certified: Azure Data Fundamentals',
      year: 'March 2022',
    },
    {
      name: 'Microsoft Certified: Azure Developer Associate',
      year: 'March 2021',
    },
    {
      name: 'Microsoft Certified: Azure Fundamentals',
      year: 'March 2021',
    },
  ],
  educations: [
    {
      institution: 'CLSU Open University',
      degree: 'Master of Science in Renewable Energy Systems',
      from: '2017',
      to: '~',
    },
    {
      institution: 'University of the East - Manila, Philippines',
      degree: 'Bachelor of Science in Computer Science',
      from: '2002',
      to: '2005',
    },
  ],
  publications: [],
  // Display articles from your medium or dev account. (Optional)
  blog: {},
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'business',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'procyon',
    ],

    // Custom theme, applied to `procyon` theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a
      class="text-primary" href="https://github.com/jajera/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a> and ❤️`,

  enablePWA: true,
};

export default CONFIG;
