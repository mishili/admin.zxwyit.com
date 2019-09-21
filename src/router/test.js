const test = [
    {
        path: '/MakeTestPaper',
        name: 'MakeTestPaper',
        component: () => import('@/views/test/MakeTestPaper')
      },
    {
        path: '/TestPaperManage',
        name: 'TestPaperManage',
        component: () => import('@/views/test/TestPaperManage')
      },
     {
       path: '/TestResult',
       name: 'TestResult',
       component: () => import('@/views/test/TestResult')
     },
     {
       path: '/TestSetter',
       name: 'TestSetter',
       component: () => import('@/views/test/TestSetter')
     },
    {
        path:"/ViewTestPaper",
        name:"ViewTestPaper",
        component:() => import('@/views/test/ViewTestPaper')
    }]
   
export default test;