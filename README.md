# todoApp
learn webpack@2.5.1 react+redux+react-redux 
### 安装插件
```
yarn add autoprefix babel-core babel-loader babel-preset-latest babel-preset-react babel-preset-stage-0 babel-preset-react-hmre css-loader less-loader file-loader html-loader html-webpack-plugin image-webpack-loader less node-sass open-browser-webpack-plugin postcss-loader redux-devtools sass-loader style-loader url-loader webpack@2.5.1 webpack-dev-server@2.5.1 webpack-strip -D
```
- extract-text-webpack-plugin 它将*.css输入块中的所有必需模块移动到单独的CSS文件中。所以你的样式不再被内联到JS包中，而是在一个单独的CSS文件（styles.css）中。如果样式表总量很大，那么它会更快，因为CSS包与JS包并行加载。
- webpack-strip 清楚代码中的console
- autoprefix    自动为css样式添加前缀
- style-loader 通过注入<style>标签将CSS添加到DOM

## windows10 dos命令行
```
mkdir 文件夹名
dir  查看文件夹下所有文件
type nul>文件名    创建文件

```
