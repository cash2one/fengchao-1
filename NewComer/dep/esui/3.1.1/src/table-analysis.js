function initBaseBuilderList(table) {
            addRowBuilderList(
                table,
                [
                    {
                        index: 1,
                        getRowArgs: getRowBaseArgs,
                        getColHtml: getColBaseHtml
                    }
                ]
            );
        }

        function getRowBaseArgs(table, rowIndex) {
            var datasource = table.datasource;
            var dataLen = datasource.length;
            return {
                tdCellClass : getClass(table, 'cell'),
                tdBreakClass : getClass(table, 'cell-break'),
                tdTextClass : getClass(table, 'cell-text'),
                fieldLen: table.realFields.length,
                rowClass: [
                    getClass(table, 'row'),
                    getClass(table, 'row-' + ((rowIndex % 2) ? 'odd' : 'even')),
                    isRowSelected(table, rowIndex)
                        ? getClass(table, 'row-selected')
                        : '',
                    dataLen - 1 === rowIndex
                        ? getClass(table, 'row-last')
                        : ''
                ].join(' ')
            };
        }

        var baseColTextTpl = '<span id="${colTextId}">${content}</span>';
        function getColBaseHtml(
            table, data, field, rowIndex, fieldIndex, extraArgs
        ) {
            var tdCellClass = extraArgs.tdCellClass;
            var tdBreakClass = extraArgs.tdBreakClass;
            var tdTextClass = extraArgs.tdTextClass;
            var tdClass = [tdCellClass];
            var textClass = [tdTextClass];
            var content = field.content;

            if (fieldIndex === 0) {
                textClass.push(getClass(table, 'cell-text-first'));
            }
            if (fieldIndex === extraArgs.fieldLen - 1) {
                textClass.push(getClass(table, 'cell-text-last'));
            }

            // 生成可换行列的样式
            if (table.breakLine || field.breakLine) {
                tdClass.push(tdBreakClass);
            }

            // 生成选择列的样式
            if (field.select) {
                textClass.push(getClass(table, 'cell-sel'));
            }

            // 计算表格对齐样式
            if (field.align) {
                tdClass.push(getClass(table, 'cell-align-' + field.align));
            }

             // 计算表格排序样式
            if (field.field && field.field === table.orderBy) {
                tdClass.push(getClass(table, 'cell-sorted'));
            }

            // 构造内容html
            var contentHtml = 'function' === typeof content
                ? content.call(table, data, rowIndex, fieldIndex)
                : (table.encode
                    ? lib.encodeHTML(data[content])
                    : data[content]
                );

            if (isNullOrEmpty(contentHtml)) {
                contentHtml = '&nbsp;';
            }

            return {
                colClass: tdClass.join(' '),    // MARK td元素上挂载的样式
                textClass: textClass.join(' '), // MARK 基础内容元素上挂载的样式
                html: lib.format(
                    baseColTextTpl,
                    {
                        colTextId: getId(
                            table,
                            'cell-textfield-' + rowIndex + '-'+ fieldIndex
                        ),
                        content: contentHtml
                    }
                )
            };
        }



function getRowHtml(table, data, index, builderList) {
            var html = [];
            var fields = table.realFields;
            var rowWidthOffset = table.rowWidthOffset;

            var extraArgsList = [];
            var rowClass = [];
            var rowAttr = [];

            for (var i = 0, l = builderList.length; i < l; i++) {
                var builder = builderList[i];
                var rowArgs = builder.getRowArgs
                            ? builder.getRowArgs(table, index) || {}
                            : {};

                extraArgsList.push(rowArgs);

                (rowArgs.rowClass) && (rowClass.push(rowArgs.rowClass));
                (rowArgs.rowAttr) && (rowAttr.push(rowArgs.rowAttr));
            }

            function sortByIndex(a, b) {
                return a.index - b.index;
            }

            for (var i = 0, l = fields.length; i < l; i++) {
                var field = fields[i];
                var colWidth = table.colsWidth[i];
                var colClass = [];
                var textClass = [];
                var colAttr = [];
                var textAttr = [];
                var textHtml = [];
                var allHtml = [];
                var textStartIndex = -1;

                for (var s = 0, t = builderList.length; s < t; s++) {
                    var colResult = builderList[s].getColHtml(
                        table, data, field, index, i, extraArgsList[s]
                    );
                    if (!colResult) {
                        continue;
                    }

                    var colHtml = colResult.html;
                    if (colResult.colClass) {
                        colClass.push(colResult.colClass);
                    }
                    if (colResult.textClass) {
                        textClass.push(colResult.textClass);
                    }
                    if (colResult.colAttr) {
                        colAttr.push(colResult.colAttr);
                    }
                    if (colResult.textAttr) {
                        textAttr.push(colResult.textAttr);
                    }

                    if (hasValue(colHtml)) {
                        if (colResult.notInText) {
                            colResult.index = s;
                            allHtml.push(colResult);
                        } else {
                            textHtml.push(colHtml);
                            (textStartIndex < 0) && (textStartIndex = s);
                        }
                    }
                }

                var contentHtml = '';
                textHtml = [
                    '<div class="' + textClass.join(' ') + '" ',
                    textAttr.join(' ') + '>',
                        textHtml.join(''),
                    '</div>'
                ].join('');

                allHtml.push({html: textHtml, index: textStartIndex});
                allHtml.sort(sortByIndex);

                if (allHtml.length > 1) {
                    var contentHtml = [
                        '<table width="100%" cellpadding="0" cellspacing="0">',
                            '<tr>'
                    ];

                    for (var s = 0, t = allHtml.length; s < t; s++) {
                        var aHtml = allHtml[s];
                        contentHtml.push(
                            '<td ',
                                hasValue(aHtml.width)
                                ? ' width="' + aHtml.width + '" '
                                : '',
                                aHtml.align
                                ? ' align="' + aHtml.align + '">'
                                : '>',
                                    aHtml.html,
                            '</td>'
                        );
                    }

                    contentHtml.push('</tr></table>');

                    contentHtml = contentHtml.join('');
                } else {
                    contentHtml = textHtml;
                }

                html.push(
                    '<td id="' + getBodyCellId(table, index, i) + '" ',
                    'class="' + colClass.join(' ')  + '" ',
                    colAttr.join(' ') + ' ',
                    'style="width:' + (colWidth + rowWidthOffset) + 'px;',
                    (colWidth ? '' : 'display:none') + '" ',
                    'data-control-table="' + table.id + '" ',
                    'data-row="' + index + '" data-col="' + i + '">',
                    contentHtml,
                    '</td>'
                );
            }

            html.unshift(
                lib.format(
                    tplRowPrefix,
                    {
                        id: getId(table, 'row') + index,
                        className: rowClass.join(' '),
                        attr: rowAttr.join(' '),
                        index: index
                    }
                ),
                lib.format(
                    tplTablePrefix,
                    { width : '100%' , controlTableId : table.id }
                )
            );

            html.push('</tr></table></div>');

            if (table.hasSubrow) {
                for (var i = 0, l = builderList.length; i <l; i++) {
                    var subrowBuilder = builderList[i].getSubrowHtml;
                    if (subrowBuilder) {
                        html.push(
                            subrowBuilder(table, index, extraArgsList[i])
                        );
                    }
                }
            }

            return html.join('');
        }


// table edit
target.addRowBuilders([
                {
                    index: 3,
                    getColHtml: getColHtml
                }
            ]);

var editentryTpl = '<div class="${className}" '
                         + 'data-row="${row}" data-col="${col}"></div>';
        /**
         * 生成每单元格内容
         * @ignore
         */
        function getColHtml(
            table, data, field, rowIndex, fieldIndex, extraArgs
        ) {
            var fieldEditable = field.editable;
            if ('function' == typeof fieldEditable) {
                fieldEditable = fieldEditable.call(table, data, rowIndex, fieldIndex, extraArgs);
            }
            if (table.editable && fieldEditable) {
                return {
                    textClass: table.getClass('cell-editable'),
                    html: lib.format(
                        editentryTpl,
                        {
                            className: table.getClass('cell-editentry'),
                            row: rowIndex,
                            col: fieldIndex
                        }
                    )
                };
            }
        }
