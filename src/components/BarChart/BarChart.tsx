'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { type BarData, type Margin, type Dimensions } from '@/types/chart';
import useGroups from '@/hooks/useGroups';

interface BarChartProps {
  // data?: BarData[];
  dimensions?: Dimensions;
  margin?: Margin;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  // data,
  dimensions = { width: 600, height: 400 },
  margin = { top: 20, right: 30, bottom: 60, left: 60 },
  color = 'steelblue',
}) => {
  const { groups } = useGroups();
  const data: BarData[] = groups.map(group => ({
    category: group.name,
    value: group.students?.length || 0,
  }));

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Очищаем SVG перед рисованием
    d3.select(svgRef.current).selectAll('*').remove();

    const { width, height } = dimensions;
    const { top, right, bottom, left } = margin;

    // Создаем контейнер SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f9f9f9')
      .style('border-radius', '8px');

    // Создаем группу для графика с отступами
    const g = svg.append('g')
      .attr('transform', `translate(${left},${top})`);

    // Вычисляем внутренние размеры
    const innerWidth = width - left - right;
    const innerHeight = height - top - bottom;

    // Создаем шкалы
    const xScale = d3.scaleBand()
      .domain(data.map((d: BarData) => d.category))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d: BarData) => d.value) as number])
      .nice()
      .range([innerHeight, 0]);

    // Рисуем столбцы
    g.selectAll<SVGRectElement, BarData>('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: BarData) => xScale(d.category) as number)
      .attr('y', (d: BarData) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: BarData) => innerHeight - yScale(d.value))
      .attr('fill', color)
      .attr('rx', 3)
      .on('mouseover', function (event: MouseEvent, d: BarData) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', 'orange');

        // Показываем tooltip
        g.append('text')
          .attr('class', 'tooltip')
          .attr('x', (xScale(d.category) as number) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.value) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.value}`)
          .style('font-weight', 'bold')
          .style('fill', '#333');
      })
      .on('mouseout', function (event: MouseEvent, d: BarData) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', color);

        // Удаляем tooltip
        g.selectAll('.tooltip').remove();
      });

    // Добавляем подписи значений
    g.selectAll<SVGTextElement, BarData>('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: BarData) => (xScale(d.category) as number) + xScale.bandwidth() / 2)
      .attr('y', (d: BarData) => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text((d: BarData) => d.value)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('pointer-events', 'none');

    // Добавляем оси
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Добавляем подписи осей
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .text('Категории');

    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text('Значения');
  }, [data, dimensions, margin, color]);

  return (
    <div className="bar-chart-container">
      <svg ref={svgRef} />
    </div>
  );
};

export default BarChart;
