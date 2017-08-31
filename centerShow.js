/**
 * Created by pc on 2017/5/24.
 */
define(function(require, exports, module) {

    var R_Echarts = require('common/widget/echarts/index');

    var categories = [
        { name: "管理员", icon: 'image://home/mod-test/img/admin.svg' },
        { name: "业务系统", icon: "image://home/mod-test/img/app.svg" },
        { name: "DB系统", icon: "image://home/mod-test/img/db.svg" },
        { name: "互联网接入", icon: "image://home/mod-test/img/ie.svg" }
    ];



    var centerShow = Ext.extend(Ext.BoxComponent,{
        cls:'',
        scope:this,
        initComponent:function(){
            this.data = {
                nodes:[],
                links:[]
            };
            this.callParent(arguments);
        },

        getNodeCfg: function (type, node) {
            var CATEGORIES_MAP = {
                admin: { categoryName: "管理员", iconSymbol: 'image://home/mod-test/img/admin.svg',itemColor: "#00ffff" ,lableTextStyle:"#80ff81"},
                sys:  {categoryName: "业务系统", iconSymbol: "image://home/mod-test/img/app.svg",itemColor: "#00ffff" ,lableTextStyle:"#00ffff" },
                db: { categoryName: "DB系统", iconSymbol: "image://home/mod-test/img/db.svg",itemColor: "#00ffff" ,lableTextStyle:"#00ffff" },
                internet: { categoryName: "互联网接入", iconSymbol: "image://home/mod-test/img/ie.svg" ,itemColor: "#ff0000" ,lableTextStyle:"#ff0000"}
            };

            return {
                id: node.id,
                name:node.name,
                category : CATEGORIES_MAP[type].categoryName,
                symbol: CATEGORIES_MAP[type].iconSymbol,
                symbolSize : node.weight,
                itemStyle: {
                    normal: {
                        color: CATEGORIES_MAP[type].itemColor
                    }
                },
                label :{
                    normal: {
                        show: node.weight>10,
                        textStyle: {
                            color: CATEGORIES_MAP[type].lableTextStyle
                        }
                    }
                }
            };
        },

        setJsonValue: function (data) {
            var nodes=[];
            //设置nodes
            Ext.each(data.nodes,function(node){
                switch(node.type){
                    case "DB":{//'DB数据库'
                        nodes.push(this.getNodeCfg('db', node));
                        break;
                    }
                    case "IE":{//'internet'
                        nodes.push(this.getNodeCfg('internet', node));
                        break;
                    }
                    case "DBA":{//'admin'
                        nodes.push(this.getNodeCfg('admin', node));
                        break;
                    }
                    default:{//'sys'
                        nodes.push(this.getNodeCfg('sys', node));
                        break;
                    }
                }
            },this);
            data.nodes=nodes;

            //设置links
            var links=[];
            Ext.each(data.links,function(link){
                if(link.exception){
                    link.lineStyle= {
                        "normal": {
                            "color": "red"
                        }
                    };
                }
                links.push(link);
            });
            data.links=links;


            this.data=data;
            if (!data) {
                return;
            }
            if (this.rendered) {
                this.update(data);
                // debugger;
                this.rePaint();
            }else {
                this.data = data;
            }
        },

        getJsonValue: function () {
            return this.data;
        },
        rePaint:function () {
            var myChart = R_Echarts.init(this.el.dom);
            option = {
                title: {
                    text: '',
                    subtext: '',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    // selectedMode: 'single',
                    data: categories.map(function(a) {
                        //return a.name;
                    })
                }],
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [{
                    name: '',
                    type: 'graph',
                    layout: 'circular',
                    circular: {
                        rotateLabel: true
                    },

                    data: this.data.nodes,
                    links: this.data.links,
                    categories: categories,
                    roam: true,
                    label: {
                        normal: {
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.3
                        }
                    }
                }]
            };

            myChart.setOption(option);
        },
        listeners: {
            resize:function(){
                this.rePaint();
            },
            afterrender: function () {
            }
        }
    });
    module.exports = centerShow;
});