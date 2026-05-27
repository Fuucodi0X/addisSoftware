import styled from "@emotion/styled";
import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes
} from "react";

export type TableDensity = "compact" | "comfortable";
export type TableResponsive = "scroll" | "stack";
export type TableRowTone = "neutral" | "selected" | "danger";

export interface TableContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  children: ReactNode;
}

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, "color"> {
  children: ReactNode;
  density?: TableDensity;
  responsive?: TableResponsive;
}

export interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, "color"> {
  children: ReactNode;
  tone?: TableRowTone;
}

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "color"> {
  children: ReactNode;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "color"> {
  children: ReactNode;
  dataLabel?: string;
}

export interface TableEmptyStateProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "color"> {
  children: ReactNode;
  colSpan: number;
}

const TableContainerShell = styled.div(({ theme }) => ({
  background: theme.colors.surface.panel,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.sm,
  overflowX: "auto",
  width: "100%"
}));

const StyledTable = styled.table<{ $density: TableDensity; $responsive: TableResponsive }>(
  ({ theme, $density, $responsive }) => {
    const paddingBlock = $density === "compact" ? theme.space[3] : theme.space[4];
    const paddingInline = $density === "compact" ? theme.space[4] : theme.space[5];

    return {
      borderCollapse: "collapse",
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      minWidth: $responsive === "scroll" ? 720 : 0,
      width: "100%",

      "th, td": {
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
        padding: `${paddingBlock}px ${paddingInline}px`,
        textAlign: "left",
        verticalAlign: "middle"
      },

      "th:last-of-type, td:last-of-type": {
        textAlign: "right"
      },

      "tbody tr:last-of-type td": {
        borderBottom: 0
      },

      "@media (max-width: 760px)": {
        minWidth: $responsive === "stack" ? 0 : 640,

        ...($responsive === "stack"
          ? {
              thead: {
                display: "none"
              },

              "tbody, tr, td": {
                display: "block",
                width: "100%"
              },

              tr: {
                borderBottom: `1px solid ${theme.colors.border.default}`,
                padding: `${theme.space[3]}px 0`
              },

              "tbody tr:last-of-type": {
                borderBottom: 0
              },

              td: {
                alignItems: "start",
                borderBottom: 0,
                display: "grid",
                gap: theme.space[4],
                gridTemplateColumns: "minmax(96px, 36%) 1fr",
                padding: `${theme.space[2]}px ${theme.space[4]}px`,
                textAlign: "left"
              },

              "td::before": {
                color: theme.colors.text.muted,
                content: "attr(data-label)",
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontWeights.bold,
                lineHeight: theme.lineHeights.body,
                textTransform: "uppercase"
              },

              "td:last-of-type": {
                textAlign: "left"
              }
            }
          : {})
      }
    };
  }
);

const StyledRow = styled.tr<{ $tone: TableRowTone }>(({ theme, $tone }) => ({
  background:
    $tone === "selected"
      ? theme.colors.intent.warningSoft
      : $tone === "danger"
        ? theme.colors.intent.dangerSoft
        : theme.colors.surface.panel,
  transition: "background-color 150ms ease",

  "&:hover": {
    background:
      $tone === "selected"
        ? theme.palette.amber[100]
        : $tone === "danger"
          ? theme.palette.rose[100]
          : theme.colors.surface.panelSubtle
  }
}));

const StyledHeaderCell = styled.th(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  color: theme.colors.text.muted,
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.black,
  letterSpacing: "0.08em",
  lineHeight: theme.lineHeights.tight,
  textTransform: "uppercase",
  whiteSpace: "nowrap"
}));

const StyledCell = styled.td(({ theme }) => ({
  color: theme.colors.text.secondary,
  lineHeight: theme.lineHeights.body
}));

const EmptyCell = styled(StyledCell)(({ theme }) => ({
  color: theme.colors.text.muted,
  fontWeight: theme.fontWeights.medium,
  padding: `${theme.space[8]}px ${theme.space[5]}px`,
  textAlign: "center"
}));

export const TableContainer = ({ children, ...props }: TableContainerProps) => (
  <TableContainerShell {...props}>{children}</TableContainerShell>
);

export const Table = ({ children, density = "comfortable", responsive = "scroll", ...props }: TableProps) => (
  <StyledTable $density={density} $responsive={responsive} {...props}>
    {children}
  </StyledTable>
);

export const TableHead = styled.thead({});

export const TableBody = styled.tbody({});

export const TableRow = ({ children, tone = "neutral", ...props }: TableRowProps) => (
  <StyledRow $tone={tone} {...props}>
    {children}
  </StyledRow>
);

export const TableHeaderCell = ({ children, scope = "col", ...props }: TableHeaderCellProps) => (
  <StyledHeaderCell scope={scope} {...props}>
    {children}
  </StyledHeaderCell>
);

export const TableCell = ({ children, dataLabel, ...props }: TableCellProps) => (
  <StyledCell data-label={dataLabel} {...props}>
    {children}
  </StyledCell>
);

export const TableEmptyState = ({ children, colSpan, ...props }: TableEmptyStateProps) => (
  <tr>
    <EmptyCell colSpan={colSpan} {...props}>
      {children}
    </EmptyCell>
  </tr>
);
