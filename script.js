document.addEventListener('DOMContentLoaded', () => {
    // 获取所有导航链接和内容区域
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有导航链接的active类
            navLinks.forEach(link => link.classList.remove('active'));
            // 为当前点击的链接添加active类
            e.target.classList.add('active');

            // 获取目标section的id
            const targetId = e.target.getAttribute('href').substring(1);
            
            // 隐藏所有section
            sections.forEach(section => section.classList.remove('active'));
            // 显示目标section
            document.getElementById(targetId).classList.add('active');
        });
    });
});
