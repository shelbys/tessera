ds.charts = ds.charts || {}

/**
 * Chart provider for rendering dashboard charts with NVD3
 */
ds.charts.nvd3 =
  (function() {

    var self = {}

    self.CHART_IMPL_TYPE = 'nvd3'
    self.DEFAULT_AUTO_HIDE_LEGEND_THRESHOLD = 6

    self.simple_line_chart = function(e, item, query) {
      var options = item.options || {}
      var data = [query.chart_data('nvd3')[0]]
        nv.addGraph(function() {
            var width = e.width()
            var height = e.height()
            var chart = nv.models.lineChart()
                .options({
                    showXAxis: false,
                    showYAxis: false,
                    showLegend: false,
                    useInteractiveGuideline: true,
                    x: function(d) { return d[1] },
                    y: function(d) { return d[0] }
                })
                .color(ds.charts.util._color_function(options.palette || ds.charts.DEFAULT_PALETTE))
                .margin(options.margin || { top: 0, right: 16, bottom: 0, left: 40 })
                .width(width)
                .height(height)
            chart.yAxis.tickFormat(d3.format((options.y1 ? options.y1.format : options.yAxisFormat) || ',.3s'))
            chart.xAxis.tickFormat(function(d) { return moment.unix(d).tz(ds.config.DISPLAY_TIMEZONE).fromNow() })
            d3.select(e.selector + ' svg')
                .attr('width', width)
                .attr('height', height)
                .datum(data)
                .call(chart)
            return chart
        })
    }

    self.standard_line_chart = function(e, item, query) {
      var options = item.options || {}
      var data = query.chart_data('nvd3')
        var showLegend = options.showLegend !== false
        if (data.length > self.DEFAULT_AUTO_HIDE_LEGEND_THRESHOLD) {
            showLegend = false
        }
        nv.addGraph(function() {
            var width = e.width()
            var height = e.height()
            var chart = nv.models.lineChart()
                .options({
                    showXAxis: options.showXAxis !== false,
                    showYAxis: options.showYAxis !== false,
                    showLegend: showLegend,
                    useInteractiveGuideline: options.useInteractiveGuideline !== false,
                    x: function(d) { return d[1] },
                    y: function(d) { return d[0] }
                })
                .color(ds.charts.util._color_function(options.palette || ds.charts.DEFAULT_PALETTE))
                //.margin(options.margin || { top: 12, right: 16, bottom: 16, left: 40 })
                .width(width)
                .height(height)
            chart.yAxis
                .axisLabelDistance((options.y1 ? options.y1.label_distance : options.yAxisLabelDistance) || 30)
                .axisLabel(options.y1 ? options.y1.label : options.yAxisLabel)
                .tickFormat(d3.format((options.y1 ? options.y1.format : options.yAxisFormat) || ',.3s'))
            chart.xAxis
                .tickFormat(function(d) { return moment.unix(d).tz(ds.config.DISPLAY_TIMEZONE).format('h:mm A') })
                .axisLabel(options.x ? options.x.label : options.xAxisLabel)
            d3.select(e.selector + ' svg')
                .attr('width', width)
                .attr('height', height)
                .datum(data)
                .call(chart)
            return chart
        })
    }

    self.simple_area_chart = function(e, item, query) {
      var options = item.options || {}
      var data = [query.chart_data('nvd3')[0]]
        nv.addGraph(function() {
            var width  = e.width()
            var height = e.height()
            var chart  = nv.models.stackedAreaChart()
                .options({
                    showLegend: false,
                    showControls: false,
                    showXAxis: false,
                    showYAxis: false,
                    useInteractiveGuideline: true,
                    x: function(d) { return d[1] },
                    y: function(d) { return d[0] }
                })
                .color(ds.charts.util._color_function(options.palette || ds.charts.DEFAULT_PALETTE))
                .style('stack')
                .width(width)
                .height(height)
                .margin(options.margin || { top: 0, right: 0, bottom: 0, left: 0 })
            chart.yAxis
                .tickFormat(d3.format((options.y1 ? options.y1.format : options.yAxisFormat) || ',.3s'))
            chart.xAxis
                .tickFormat(function(d) { return moment.unix(d).tz(ds.config.DISPLAY_TIMEZONE).fromNow() })
            d3.select(e.selector + ' svg')
                .attr('width', width)
                .attr('height', height)
                .datum(data)
                .transition()
                .call(chart)
            return chart
        })
    }

    self.stacked_area_chart = function(e, item, query) {
        var options = item.options || {}
        var showLegend = options.showLegend !== false
      var data = query.chart_data('nvd3')
        if (data.length > self.DEFAULT_AUTO_HIDE_LEGEND_THRESHOLD) {
            showLegend = false
        }
        nv.addGraph(function() {
            var width  = e.width()
            var height = e.height()
            var chart  = nv.models.stackedAreaChart()
                .options({
                    showLegend: showLegend,
                    useInteractiveGuideline: options.useInteractiveGuideline !== false,
                    showXAxis: options.showXAxis !== false,
                    showYAxis: options.showYAxis !== false,
                    x: function(d) { return d[1] },
                    y: function(d) { return d[0] }
                })
                .color(ds.charts.util._color_function(options.palette || ds.charts.DEFAULT_PALETTE))
                .style(options.style || 'stack')
                .width(width)
                .height(height)
            chart.yAxis
                .axisLabel(options.y1 ? options.y1.label : options.yAxisLabel)
                .axisLabelDistance((options.y1 ? options.y1.label_distance : options.yAxisLabelDistance) || 30)
                .tickFormat(d3.format((options.y1 ? options.y1.format : options.yAxisFormat) || ',.3s'))
            chart.xAxis
                .axisLabel(options.x ? options.x.label : options.xAxisLabel)
                .tickFormat(function(d) { return moment.unix(d).tz(ds.config.DISPLAY_TIMEZONE).format('h:mm A') })
            d3.select(e.selector + ' svg')
                .attr('width', width)
                .attr('height', height)
                .datum(data)
                .transition()
                .call(chart)
            return chart
        })
    }

    self.donut_chart = function(e, item, query) {
      var options = item.options || {}
      var transform = item.transform || 'sum'
      var series = query.chart_data('nvd3')
        var showLegend = options.showLegend !== false
        if (series.length > self.DEFAULT_AUTO_HIDE_LEGEND_THRESHOLD) {
            showLegend = false
        }
        var data = series.map(function(series) {
            return {
                label: series.key,
                y: series.summation[transform]
            }
        })
        nv.addGraph(function() {
            var width  = e.width()
            var height = e.height()
            var chart  = nv.models.pieChart()
            /* .options({
               showLegend: showLegend,
               useInteractiveGuideline: options.useInteractiveGuideline !== false,
               x: function(d) { return d.key },
               y: function(d) { return d.y }
               }) */
                .showLegend(showLegend)
                .x(function(d) { return d.label || d.key })
                .color(ds.charts.util._color_function(options.palette || ds.charts.DEFAULT_PALETTE))
                .labelType(options.labelType || "percent")
                .donut(options.donut !== false)
                .donutRatio(options.donutRatio || 0.3)
                .showLabels(options.showLabels !== false)
                .donutLabelsOutside(options.donutLabelsOutside !== false)
                .width(width)
                .height(height)
                .margin(options.margin || { top: 0, right: 0, bottom: 0, left: 0 })
            d3.select(e.selector + ' svg')
                .attr('width', width)
                .attr('height', height)
                .datum(data)
                .transition()
                .call(chart)
            return chart
        })
    }

    self.process_series = function(series) {
      var result = {}
      if (series.summation) {
        result.summation = series.summation
      }
      result.key = series.target
      result.values = series.datapoints
      return result
    }

    return self
})()
