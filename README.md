## Drags

一个简单易用的拖拽插件，无需依赖，实例化即可

```
    new DragDom({
      root: ".dragContainer",  // 根容器
      dragLis: ".dragList .li", // 标签节点
      dragInContainer: ".dragInContainer",  // 拖拽至某容器
      autoTest: "autoTest" // 自动化地址    localhost:3000/?autoTest=  可缺省
    });
```