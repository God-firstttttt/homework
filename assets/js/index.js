const { layer } = layui;
// 头像渲染方法
function getUserInfo() {
    axios.get('/my/userinfo').then(res => {
        if (res.status != 0) {
            return layer.msg('获取用户信息失败！');
        }
        const { data } = res;
        const name = data.nickname || data.username;
        $('#welcome').text(`欢迎${name}`);
        if (data.user_pic) {
            $('.avatar').prop('src', data.user_pic).show();
            $('.text-avatar').hide();
        } else {
            $('.text-avatar').text(name[0].toUpperCase()).show();
            $('.avater').hide();
        }

    })
};
getUserInfo();
$('#logout').click(function() {
    layer.confirm('确认退出?', { icon: 3, title: '提示' }, function(index) {
        localStorage.removeItem('token');
        location.href = './login.html';
    })
})