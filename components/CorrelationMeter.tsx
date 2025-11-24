import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CorrelationMeterProps {
  correlation: number;
}

export const CorrelationMeter: React.FC<CorrelationMeterProps> = ({ correlation }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 250;
    const height = 150;
    const radius = Math.min(width, height) / 1.5;
    const cx = width / 2;
    const cy = height - 20;

    // Scale for arc (-1 to 1 mapped to -PI/2 to PI/2)
    const scale = d3.scaleLinear()
      .domain([-1, 1])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Background Arc
    const arc = d3.arc()
      .innerRadius(radius - 15)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("transform", `translate(${cx},${cy})`)
      .attr("d", arc as any)
      .attr("fill", "#1e293b");

    // Active Arc (Colored based on correlation)
    // Negative (Red) -> Neutral (Gray) -> Positive (Green)
    const colorScale = d3.scaleLinear<string>()
      .domain([-1, 0, 1])
      .range(["#f43f5e", "#94a3b8", "#10b981"]);

    const activeArc = d3.arc()
        .innerRadius(radius - 15)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(scale(correlation));
    
    svg.append("path")
        .attr("transform", `translate(${cx},${cy})`)
        .attr("d", activeArc as any)
        .attr("fill", colorScale(correlation));

    // Needle
    const needleLen = radius - 20;
    const angle = scale(correlation) - Math.PI/2; // Adjust for rotation
    // Calculate tip coordinates manually for a simple line
    const x2 = cx + needleLen * Math.cos(scale(correlation) - Math.PI/2);
    const y2 = cy + needleLen * Math.sin(scale(correlation) - Math.PI/2);

    // Pivot Circle
    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 5)
        .attr("fill", "#e2e8f0");

    // Needle Line
    svg.append("line")
        .attr("x1", cx)
        .attr("y1", cy)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round");
        
    // Text Label
    svg.append("text")
        .attr("x", cx)
        .attr("y", cy - radius - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#f8fafc")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text(correlation.toFixed(2));

    svg.append("text")
        .attr("x", cx)
        .attr("y", cy - radius + 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", "12px")
        .text("Correlation");

  }, [correlation]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
      <svg ref={svgRef} width={250} height={150}></svg>
      <div className="mt-2 text-center text-sm text-slate-400">
        {correlation > 0.7 ? "Strong Positive" : correlation < -0.7 ? "Strong Negative" : "Weak/No Correlation"}
      </div>
    </div>
  );
};
