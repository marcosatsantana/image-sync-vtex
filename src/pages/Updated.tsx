import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { CheckCircle2, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, AlertCircle, Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/services/monitorService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

const Updated = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter States
  const [skuFilter, setSkuFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('SUCCESS');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['history', page, limit, skuFilter, dateRange, statusFilter],
    queryFn: () => getHistory(
      page,
      limit,
      skuFilter,
      dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
      statusFilter
    ),
    refetchInterval: 5000
  });

  const updatedItems = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Sucesso';
      case 'ERROR':
        return 'Com erro';
      case 'PROCESSING':
        return 'Processando';
      default:
        return 'Status Desconhecido';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar activeFilter="updated" />

      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Produtos Atualizados
              </h2>
            </div>
            <p className="text-muted-foreground">
              Produtos que tiveram suas imagens atualizadas com sucesso
            </p>
          </div>

          {/* Stats & Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end mb-6">
            <Badge variant="secondary" className="text-base px-4 py-2 h-fit">
              {pagination?.total || 0} itens atualizados
            </Badge>

            <div className="flex flex-wrap gap-2 items-center bg-card p-2 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>

              <div className="relative">
                <Search className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="SKU"
                  value={skuFilter}
                  onChange={(e) => {
                    setSkuFilter(e.target.value);
                    setPage(1); // Reset page on filter change
                  }}
                  className="h-8 w-fit pl-7 text-xs"
                />
              </div>

              <div className="w-fit">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUCCESS">Sucesso</SelectItem>
                    <SelectItem value="ERROR">Com Erro</SelectItem>
                    <SelectItem value="All">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <DatePickerWithRange
                  date={dateRange}
                  setDate={(range) => {
                    setDateRange(range);
                    setPage(1);
                  }}
                />
              </div>

              {(skuFilter || dateRange || statusFilter !== 'SUCCESS') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSkuFilter('');
                    setDateRange(undefined);
                    setStatusFilter('SUCCESS');
                    setPage(1);
                  }}
                  title="Limpar filtros"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : updatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Nenhum item encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  updatedItems.map((item) => {
                    let details: any = {};
                    try {
                      details = JSON.parse(item.details || '{}');
                    } catch (e) { }
                    const isExpanded = expandedRows.has(item.id);

                    return (
                      <>
                        <TableRow
                          key={item.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleRow(item.id)}
                        >
                          <TableCell>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.product_id}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "border-opacity-20",
                                item.status === 'SUCCESS' ? "bg-green-500/10 text-green-500 border-green-500" :
                                  item.status === 'ERROR' ? "bg-red-500/10 text-red-500 border-red-500" :
                                    "bg-yellow-500/10 text-yellow-500 border-yellow-500"
                              )}
                            >
                              {getStatus(item.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={4}>
                              <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2 text-sm">Detalhes do Processamento</h4>
                                    <div className="bg-card p-3 rounded-md border text-sm space-y-2">
                                      {details.friendlyError && (
                                        <div className="flex items-center gap-2 p-3 mb-3 text-red-600 bg-red-50 border border-red-100 rounded-md">
                                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                          <span className="font-medium">{details.friendlyError}</span>
                                        </div>
                                      )}
                                      {details.url && (
                                        <div className="mb-2">
                                          <span className="text-muted-foreground block text-xs mb-1">Imagem Processada:</span>
                                          <div className="h-20 w-20 rounded-md overflow-hidden border border-border">
                                            <img src={details.url} alt="Processed" className="w-full h-full object-cover" />
                                          </div>
                                        </div>
                                      )}
                                      {Object.entries(details).map(([key, value]) => {
                                        if (key === 'url') return null;
                                        return (
                                          <div key={key} className="flex flex-col">
                                            <span className="text-muted-foreground text-xs capitalize">{key.replace(/_/g, ' ')}:</span>
                                            <span className="font-medium break-all">{String(value)}</span>
                                          </div>
                                        );
                                      })}
                                      {Object.keys(details).length === 0 && (
                                        <span className="text-muted-foreground italic">Sem detalhes adicionais disponíveis.</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={cn(
                        "gap-1 pl-2.5",
                        page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      )}
                      size="default"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Anterior</span>
                    </PaginationLink>
                  </PaginationItem>

                  {(() => {
                    const totalPages = pagination.totalPages;
                    const items = [];

                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) {
                        items.push(i);
                      }
                    } else {
                      items.push(1);
                      if (page > 3) items.push('ellipsis-start');

                      const start = Math.max(2, page - 1);
                      const end = Math.min(totalPages - 1, page + 1);

                      for (let i = start; i <= end; i++) {
                        items.push(i);
                      }

                      if (page < totalPages - 2) items.push('ellipsis-end');
                      items.push(totalPages);
                    }

                    return items.map((item, index) => {
                      if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <span className="flex h-9 w-9 items-center justify-center">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More pages</span>
                            </span>
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={item}>
                          <PaginationLink
                            href="#"
                            isActive={page === item}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(item as number);
                            }}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    });
                  })()}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={cn(
                        "gap-1 pr-2.5",
                        page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                      )}
                      size="default"
                    >
                      <span>Próximo</span>
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main >
    </div >
  );
};

export default Updated;
