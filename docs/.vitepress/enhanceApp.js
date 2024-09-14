// https://tongji.baidu.com/web5/10000538142/welcome/login

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (typeof _hmt !== "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }

    next();
  });
};
