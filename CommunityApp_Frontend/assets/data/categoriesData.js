const categoriesData = [
    {
      id: '1',
      image: require('../images/Report.png'),
      title: 'Report Problem',
      selected: true,
      navigateTo: 'report',
    },
    {
        id: '2',
        image: require('../images/Donate.png'),
        title: 'Donate',
        selected: false,
        navigateTo: 'donations',
    },
    {
        id: '3',
        image: require('../images/cEvents.png'),
        title: 'Events',
        selected: false,
        navigateTo: 'events',
    },    
    {
        id: '4',
        image: require('../images/Marketspace.png'),
        title: 'Marketspace',
        selected: false,
    },
  ];

  export default categoriesData;