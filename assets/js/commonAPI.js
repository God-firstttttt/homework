// 为全局的axios请求设置根路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';
// 添加全局拦截器
axios.interceptors.request.use(function(config) {

    const token = localStorage.getItem('token') || '';

    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    const { message, status } = response.data;
    // 判断身份验证是否失效
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token');
        location.href = './login.html';
    }
    return response.data;
}, function(error) {
    return Promise.reject(error)
})