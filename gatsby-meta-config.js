module.exports = {
  title: `Rlog`,
  description: `Roach Dev log`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://www.roach-dev.com/`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: ``, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `정승현`,
    bio: {
      role: `엔지니어`,
      description: ['기술로 편리한 세상을 만드는'],
      thumbnail: 'profile.jpeg', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/tmdgusya`, // `https://github.com/zoomKoding`,
      linkedIn: `https://www.linkedin.com/in/%EC%8A%B9%ED%98%84-%EC%A0%95-376842221/`, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `dev0jsh@gmail.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '2021.11 ~ 재직중',
        activity: '우아한 형제들 서버개발자',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2021.11 ~ 재직중',
        activity: '우아한 형제들 서버개발자',
        links: {
          post: 'https://www.linkedin.com/in/%EC%8A%B9%ED%98%84-%EC%A0%95-376842221/',
        },
      },
      {
        date: '2021.05 ~ 2021.11',
        activity: '청소연구소 백엔드 서버 개발자',
        links: {
          post: 'https://www.linkedin.com/in/%EC%8A%B9%ED%98%84-%EC%A0%95-376842221/',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: '코틀린 테스트 코드 생성 자동화 프로그램',
        description:
          '유닛 테스트 코드에서 항상 작성해야 하는 Mock 객체 등등을 자동으로 파일을 분석하여 만들어주는 프로그램입니다.',
        techStack: ['kotlin', 'intellij engine'],
        thumbnailUrl: 'kotest.jpeg',
        links: {
          github: 'https://github.com/tmdgusya/kotlin-test-boilerplate',
        },
      },
    ],
  },
  comments: {
    utterances: {
        repo: 'tmdgusya/zoomkoding-gatsby-blog' // zoomkoding/gatsby-starter-zoomkoding
    },
  },
};
