import React from "react";
import { Dataset, EChartsx, LineSeries, Once, Tooltip } from "@djagger/echartsx";
import { useAnalyzeChartContext } from "../context";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDiff, usePartData, useReversed } from "./hooks";
import { Diff } from "./ui";
import { AxisBase, formatDate } from "./base";

interface BarsProps {
  title: string;
  color: string;
  dayKey?: string;
  dayValueKey: string;
  totalKey: string;
}

export default function LinesCompare({ color, title, dayValueKey, dayKey = 'period_day', totalKey }: BarsProps) {
  const { data } = useAnalyzeChartContext<any>();
  const diff = useDiff(data.data?.data ?? [], totalKey, dayKey);
  const reversed = useReversed(data.data?.data ?? []);
  const currentData = usePartData(reversed, 'current', dayValueKey, dayKey);
  const lastData = usePartData(reversed, 'last', dayValueKey, dayKey);

  return (
    <Stack direction="row">
      <Box display="flex" minWidth={84} flexDirection="column" justifyContent="center">
        <Typography fontSize={14} color="#C4C4C4" fontWeight="bold" whiteSpace="nowrap">
          {title}
        </Typography>
        <Typography color={color} fontWeight="bold" fontSize={16}>
          {data.data?.data[0]['current_' + totalKey]}
          <Diff value={diff} />
        </Typography>
      </Box>
      <EChartsx style={{ flex: 1, width: '100%' }} init={{ height: 72, renderer: 'canvas' }} theme="dark">
        <Once>
          <AxisBase />
          <Tooltip trigger="axis" axisPointer={{}} formatter={formatter(title)} />
          <LineSeries encode={{ x: 'idx', y: 'value' }} color={color} datasetId="current" showSymbol={false} smooth />
          <LineSeries encode={{ x: 'idx', y: 'value' }} color="#7C7C7C" datasetId="last" showSymbol={false} smooth />
        </Once>
        <Dataset id="current" source={currentData} />
        <Dataset id="last" source={lastData} />
      </EChartsx>
    </Stack>
  );
}

const formatter = (title: string) => (seriesList: any[]): string => {
  return seriesList.map(series => `${series.marker} ${formatDate(series.data.day)}: <b>${series.data.value}</b> ${title}`).join('<br>');
};
