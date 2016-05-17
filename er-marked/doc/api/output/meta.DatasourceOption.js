Ext.data.JsonP.meta_DatasourceOption({"tagname":"class","name":"meta.DatasourceOption","autodetected":{},"files":[{"filename":"DatasourceOption.js","href":"DatasourceOption.html#meta-DatasourceOption"}],"members":[{"name":"dump","tagname":"property","owner":"meta.DatasourceOption","id":"property-dump","meta":{}},{"name":"name","tagname":"property","owner":"meta.DatasourceOption","id":"property-name","meta":{}},{"name":"retrieve","tagname":"method","owner":"meta.DatasourceOption","id":"method-retrieve","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-meta.DatasourceOption","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/DatasourceOption.html#meta-DatasourceOption' target='_blank'>DatasourceOption.js</a></div></pre><div class='doc-contents'><p>数据模型数据源配置项</p>\n\n<p>用于<a href=\"#!/api/Model-property-datasource\" rel=\"Model-property-datasource\" class=\"docClass\">Model.datasource</a>的配置</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-dump' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='meta.DatasourceOption'>meta.DatasourceOption</span><br/><a href='source/DatasourceOption.html#meta-DatasourceOption-property-dump' target='_blank' class='view-source'>view source</a></div><a href='#!/api/meta.DatasourceOption-property-dump' class='name expandable'>dump</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>指定是否展开数据\n\n如果此配置为true，则name配置无效，\n由retrieve获得的数据将\n直接展开到当前@{link Model}对象上\n\n需要注意的是，如果此属性为true而获得的数据不是对象类型，则可能出现不可预期的情况 ...</div><div class='long'><p>指定是否展开数据</p>\n\n<p>如果此配置为<code>true</code>，则<a href=\"#!/api/meta.DatasourceOption-property-name\" rel=\"meta.DatasourceOption-property-name\" class=\"docClass\">name</a>配置无效，\n由<a href=\"#!/api/meta.DatasourceOption-method-retrieve\" rel=\"meta.DatasourceOption-method-retrieve\" class=\"docClass\">retrieve</a>获得的数据将\n直接展开到当前@{link Model}对象上</p>\n\n<p>需要注意的是，如果此属性为<code>true</code>而获得的数据不是对象类型，则可能出现不可预期的情况</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-name' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='meta.DatasourceOption'>meta.DatasourceOption</span><br/><a href='source/DatasourceOption.html#meta-DatasourceOption-property-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/meta.DatasourceOption-property-name' class='name expandable'>name</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'><p>对应的属性名称</p>\n\n<p>如果此配置项的值是一个数组或非<code><a href=\"#!/api/meta.DatasourceOption\" rel=\"meta.DatasourceOption\" class=\"docClass\">meta.DatasourceOption</a></code>对象，\n那么<code>name</code>属性是不起作用的，仅仅是为了符合javascript的语法而做的占位符</p>\n</div><div class='long'><p>对应的属性名称</p>\n\n<p>如果此配置项的值是一个数组或非<code><a href=\"#!/api/meta.DatasourceOption\" rel=\"meta.DatasourceOption\" class=\"docClass\">meta.DatasourceOption</a></code>对象，\n那么<code>name</code>属性是不起作用的，仅仅是为了符合javascript的语法而做的占位符</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-retrieve' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='meta.DatasourceOption'>meta.DatasourceOption</span><br/><a href='source/DatasourceOption.html#meta-DatasourceOption-method-retrieve' target='_blank' class='view-source'>view source</a></div><a href='#!/api/meta.DatasourceOption-method-retrieve' class='name expandable'>retrieve</a>( <span class='pre'>model, option</span> ) : Mixed | <a href=\"#!/api/meta.Promise\" rel=\"meta.Promise\" class=\"docClass\">meta.Promise</a><span class=\"signature\"></span></div><div class='description'><div class='short'>获取数据的方法 ...</div><div class='long'><p>获取数据的方法</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>model</span> : <a href=\"#!/api/Model\" rel=\"Model\" class=\"docClass\">Model</a><div class='sub-desc'><p>当前的<a href=\"#!/api/Model\" rel=\"Model\" class=\"docClass\">Model</a>对象</p>\n</div></li><li><span class='pre'>option</span> : <a href=\"#!/api/meta.DatasourceOption\" rel=\"meta.DatasourceOption\" class=\"docClass\">meta.DatasourceOption</a><div class='sub-desc'><p>当前属性对应的配置项</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed | <a href=\"#!/api/meta.Promise\" rel=\"meta.Promise\" class=\"docClass\">meta.Promise</a></span><div class='sub-desc'><p>如果方法返回一个<a href=\"#!/api/meta.Promise\" rel=\"meta.Promise\" class=\"docClass\">meta.Promise</a>对象，\n则等待该对象进入<code>resolved</code>状态，将进入<code>resolved</code>状态时的参数作为数据。\n如果是其它类型的对象，则直接作为数据使用</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});