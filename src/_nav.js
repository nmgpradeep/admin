export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    
    {
      name: 'Manage User',
      url: '/',
      icon: 'icon-people icons',
      children: [
        {
          name: 'Users',
          url: '/users',
          icon: 'icon-people icons',
        },
        {
          name: 'New User',
          url: '/users/add',
          icon: 'icon-user',
        },       
      ],
    },
    {
      name: 'Manage Category',
      url: '/categories',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Categories',
          url: '/categories',
          icon: 'icon-puzzle',
        },
        {
          name: 'New Category',
          url: '/categories/add',
          icon: 'icon-puzzle',
        },       
      ],
    },
    {
      name: 'Manage Product',
      url: '/products',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Products',
          url: '/products',
          icon: 'icon-cursor',
        },
        {
          name: 'New Product',
          url: '/products/add',
          icon: 'icon-cursor',
        },       
      ],
    },
    {
      name: 'Manage Attributes',
      url: '/attributes',
      icon: 'icon-layers',
      children: [
        {
          name: 'Brands',
          url: '/brand',
          icon: 'icon-layers',
        },
        {
          name: 'Sizes',
          url: '/size',
          icon: 'icon-layers'
        },     
      ],
    },
    {
      name: 'Manage Trades',
      url: '/trades',
      icon: 'icon-calculator',
      children: [
        {
          name: 'Trades',
          url: '/trades',
          icon: 'icon-calculator',
        }
        // {
        //   name: 'New Trade',
        //   url: '/trades/add',
          
        // }              
      ],
    },
    {
      name: 'Manage Subscription',
      url: '/subscriptions',
      icon: 'icon-pie-chart',
      children: [
        {
          name: 'Subscriptions',
          url: '/subscriptions',
          icon: 'icon-pie-chart',
        },
        {
          name: 'New Subscription',
          url: '/subscriptions/add',
          icon: 'icon-pie-chart',
        },
        {
          name: 'Addon Packages',
          url: '/addon',
          icon: 'icon-pie-chart',
        }, 
        {
          name: 'New Addon Package',
          url: '/addon/add',
          icon: 'icon-pie-chart',
        },        
      ],
    },
     {
      name: 'Manage Donation',
      url: '/donations',
      icon: 'icon-present',
      children: [
        {
          name: 'Donations',
          url: '/donations',
          icon: 'icon-present',
        },
        {
          name: 'New Donation',
          url: '/donations/add',
          icon: 'icon-present',
        },       
      ],
    },
     {
      name: 'Manage Transactions',
      url: '/transactions',
      icon: 'icon-layers',
      children: [
        {
          name: 'Transactions',
          url: '/transactions',
          icon: 'icon-layers',
        },     
      ],
    },
    
      {
      name: 'Manage Ads',
      url: '/advertisement',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Advertisement',
          url: '/advertisement',
          icon: 'icon-cursor',
        },
        {
          name: 'New Ads',
          url: '/advertisement/add',
          icon: 'icon-cursor',
        },       
      ],
    },
    {
      name: 'Manage Testimonials',
      url: '/testimonial',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Testimonial',
          url: '/testimonial',
          icon: 'icon-cursor',
        },
        {
          name: 'New Testimonial',
          url: '/testimonial/add',
          icon: 'icon-cursor',
        },       
      ],
    },
    {
      title: true,
      name: 'Extras',
    },
  
    {
      name: 'Manage CMS Page',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'CMS Page',
          url: '/pages',
          icon: 'icon-star',
        },
        {
          name: 'New Page',
          url: '/pages/add',
          icon: 'icon-star',
        },       
      ],
    },
    {
      name: 'Manage Location',
      url: '/locations',
      icon: 'icon-map',
      children: [
        {
          name: 'Country',
          url: '/country'
        },
        {
          name: 'State',
          url: '/state'
        },
        {
          name: 'City',
          url: '/city'
        }
      ]
    },
   
    {
      name: 'Notifications Setting',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
      {
          name: 'Email',
          url: '/setting/email',
          icon: 'icon-bell',
        },
        //~ {
          //~ name: 'Alert',
          //~ url: '/notifications/alerts',
          //~ icon: 'icon-bell',
        //~ },
        //~ {
          //~ name: 'Badges',
          //~ url: '/notifications/badges',
          //~ icon: 'icon-bell',
        //~ },
        //~ {
          //~ name: 'Modals',
          //~ url: '/notifications/modals',
          //~ icon: 'icon-bell',
        //~ },
      ],
    },
    //~ {
      //~ name: 'Widgets',
      //~ url: '/widgets',
      //~ icon: 'icon-calculator',
      //~ badge: {
        //~ variant: 'info',
        //~ text: 'NEW',
      //~ },
    //~ },
    //~ {
      //~ divider: true,
    //~ },
    
    //~ {
      //~ name: 'Pages',
      //~ url: '/pages',
      //~ icon: 'icon-star',
      //~ children: [
        //~ {
          //~ name: 'Login',
          //~ url: '/login',
          //~ icon: 'icon-star',
        //~ },
        //~ {
          //~ name: 'Register',
          //~ url: '/register',
          //~ icon: 'icon-star',
        //~ },
        //~ {
          //~ name: 'Error 404',
          //~ url: '/404',
          //~ icon: 'icon-star',
        //~ },
        //~ {
          //~ name: 'Error 500',
          //~ url: '/500',
          //~ icon: 'icon-star',
        //~ },
      //~ ],
    //~ },
    {
      name: 'Download Reports',
      url: '#',
      icon: 'icon-cloud-download',
      class: 'mt-auto',
      variant: 'success',
    },
    //~ {
      //~ name: 'Try CoreUI PRO',
      //~ url: 'http://coreui.io/pro/react/',
      //~ icon: 'icon-layers',
      //~ variant: 'danger',
    //~ },
  ],
};
