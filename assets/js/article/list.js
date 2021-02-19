$(function() {
    const { form, laypage } = layui;
    let state = '';
    console.log(location.search);


    function grtCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                };

                // 遍历数组，渲染下拉组件的选项
                res.data.forEach(item => {
                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`);

                });
                form.render();
            })

    };
    grtCateList();

    // 定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值，第几页
        pagesize: 2, //表示每页显示多少条数据
        cate_id: '', //表示文章的分类id
        state: '' //表示文章的状态
    };

    // 发送请求到服务器，获取文章列表
    function renderTable() {
        axios.get('/my/article/list', { params: query })
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                template.defaults.imports.dateFormat = function(date) {
                    return moment(date).format('YYYY/MM/DD HH:mm:ss')
                };
                const htmlStr = template('tpl', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            })
    };
    renderTable();

    // 把服务端获取的数据，渲染到分页器上
    function renderPage(total) {

        laypage.render({
            elem: 'test1',
            count: total,
            limit: query.pagesize,
            limits: [2, 3, 5, 10],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版

            jump: function(obj, first) {
                // obj包含了当前分页的所有参数，如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据
                console.log(obj.limit); //得到每页显示的条数
                // 修改查询对象的参数
                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                // 首次不执行
                if (!first) {
                    // 非首次进入页面，需要重新渲染表格数据
                    renderTable();
                }
            }
        });
    };

    // 表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        const cate_id = $('#cate-sel').val();
        const state = $('#state').val();
        console.log(cate_id, state);
        query.cate_id = cate_id;
        query.state = state;
        query.pagenum = 1;

        renderTable()
    });

    // 点击删除按钮，删除当前文章
    $(document).on('click', '.del-btn', function() {

        const id = $(this).data('id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            axios.get('/my/article/delete/' + id)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！!');
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        query.pagenum--;
                    }

                    renderTable()

                })
        })

    });

    // 点击编辑按钮，跳转到文章编辑页面
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        location.href = `./edit.html?id=${id}`;
        window.parent.$('.layui-this').next().find('a').click();

    })














})