import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/mock-data';

export function TopProducts() {
  // Top 5 por revenue
  const top = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Productos</CardTitle>
        <p className="text-xs text-muted-foreground">Por ingresos generados</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top.map((product, i) => (
            <div key={product.id} className="flex items-center gap-3">
              {/* Ranking */}
              <span className="text-sm font-bold text-muted-foreground w-5 text-center">
                {i + 1}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>

              {/* Stats */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">${product.revenue.toLocaleString('es-CL')}</p>
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">{product.sales} ventas</span>
                </div>
              </div>

              {/* Status */}
              <Badge
                variant={product.status === 'active' ? 'default' : 'secondary'}
                className="text-xs shrink-0"
              >
                {product.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
