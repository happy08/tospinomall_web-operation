// 自动引入所有的vue文件
//  ./为当前目录， true为是否匹配当前文件夹
const requireComponent = require.context("./", true, /\.vue$/);
const install = (app) => {
    requireComponent.keys().forEach((fileName) => {
        const config = requireComponent(fileName); // 拿到的是vue文件的文件名
        const componentName = config.default.name; // 拿到的是vue文件中export default 下的name
        app.component(componentName, config.default || config);
    });
};

export default install;
