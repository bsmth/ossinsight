import React, { useMemo } from 'react';
import { useAnalyzeChartContext, useAnalyzeContext } from '../context';
import Grid from '@mui/material/Grid';
import {StaticSummaryItem, SummaryItem} from './SummaryItem';
import {HeaderGrid, HeadText} from './styled';
import Skeleton from '@mui/material/Skeleton';
import Analyze from '../Analyze';
import Stack from '@mui/material/Stack';
import type {RepoInfo} from '@ossinsight/api';
import { useDebugDialog } from "../../../../components/DebugDialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type ItemBase = {
  icon?: React.ReactNode
  title: React.ReactNode
  alt: string
}

export type QueryItem = ItemBase & {
  field: any;
}

export type StaticItem = ItemBase & {
  data?: (repoInfo: RepoInfo) => any
  comparingData?: any
}

export interface SummaryProps {
  query: string
  items: (QueryItem | StaticItem)[];
}

const singleSize = [4, 6] as const;
const compareSize = [4, 3] as const;
const singleSmSize = [4, 8] as const;
const compareSmSize = [4, 4] as const;

export default function Summary({items, query}: SummaryProps) {
  const {comparingRepoId, repoName, comparingRepoName} = useAnalyzeContext();
  const theme = useTheme()

  const isSmall = useMediaQuery(theme.breakpoints.down('lg'));

  const sizes = useMemo(() => {
    if (!!comparingRepoId) {
      return isSmall ? compareSmSize : compareSize;
    } else {
      return isSmall ? singleSmSize : singleSize;
    }
  }, [isSmall, comparingRepoId]);

  return (
    <Analyze query={query}>
      <Stack gap={1}>
        <Grid container flexWrap='wrap'>
          <Grid item xs={4}>
            <Typography component='h3' fontSize={20} fontWeight='bold'>Overview</Typography>
          </Grid>
          <Grid item xs={isSmall ? 8 : 6} textAlign='right'>
            <DebugInfo />
          </Grid>
        </Grid>
        <Grid container gap={1} wrap="nowrap">
          <HeaderGrid item xs={sizes[0]}>
            &nbsp;
          </HeaderGrid>
          <HeaderGrid item xs={sizes[1]} sx={{textAlign: 'right'}}>
            <HeadText>
              {repoName}
            </HeadText>
          </HeaderGrid>
          {comparingRepoId
            ? (
              <HeaderGrid item xs={sizes[1]} sx={{textAlign: 'right'}}>
                <HeadText>
                  {comparingRepoName ?? <Skeleton variant="text" />}
                </HeadText>
              </HeaderGrid>)
            : undefined}
        </Grid>
        {items.map((item, i) => {
          if ('field' in item) {
            return (
              <SummaryItem container flexWrap="nowrap" gap={1} {...item} sizes={sizes} key={item.field} />
            );
          } else {
            const {data, comparingData, ...props} = item;
            return <StaticSummaryItem key={i} container flexWrap="nowrap" gap={1} data={data}
                                      comparingData={comparingData} {...props} sizes={sizes} />;
          }
        })}
      </Stack>
    </Analyze>
  );
}

const DebugInfo = () => {
  const { data } = useAnalyzeChartContext();
  const { dialog: debugDialog, button: debugButton } = useDebugDialog(data.data);

  return (
    <Box mb={1}>
      {debugButton}
      {debugDialog}
    </Box>
  )
};
