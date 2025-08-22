# Design System PetGet

Sistema de design reutilizável para a plataforma PetGet, construído com **shadcn/ui**, **Tailwind CSS** e **TypeScript**.

## 🎨 Tokens de Design

### Paleta de Cores

#### Cores Principais
- **Primary**: `sky-500` (#0EA5E9) - Azul principal do PetGet
- **Primary Foreground**: `white` (#FFFFFF)
- **Secondary**: `slate-100` (#F1F5F9)
- **Secondary Foreground**: `slate-800` (#1E293B)

#### Cores de Estado
- **Success**: `green-500` (#22C55E)
- **Warning**: `amber-500` (#F59E0B)
- **Destructive**: `red-500` (#EF4444)
- **Muted**: `slate-500` (#64748B)

#### Cores de Fundo
- **Background**: `slate-50` (#F8FAFC)
- **Card**: `white` (#FFFFFF)
- **Popover**: `white` (#FFFFFF)
- **Accent**: `sky-50` (#F0F9FF)

#### Cores para Gráficos
- **Chart 1**: `sky-500` (#0EA5E9)
- **Chart 2**: `green-500` (#22C55E)
- **Chart 3**: `amber-500` (#F59E0B)
- **Chart 4**: `purple-500` (#A855F7)
- **Chart 5**: `pink-500` (#EC4899)

### Tipografia

- **Font Family**: Inter (principal), Poppins (títulos)
- **Font Sizes**: Seguindo escala Tailwind (text-xs a text-4xl)
- **Font Weights**: 300, 400, 500, 600, 700
- **Line Heights**: Otimizadas para legibilidade

### Espaçamentos

- **Radius**: 0.75rem (12px) como padrão
- **Spacing**: Escala Tailwind (0.25rem a 6rem)
- **Gaps**: 0.5rem, 1rem, 1.5rem, 2rem

## 🧩 Componentes

### Componentes Base (shadcn/ui)

#### Button
```tsx
import { Button } from '@/components/ui/button';

// Variantes disponíveis
<Button variant="default">Padrão</Button>
<Button variant="destructive">Destrutivo</Button>
<Button variant="outline">Contorno</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="link">Link</Button>

// Tamanhos disponíveis
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Ícone</Button>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

#### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Destrutivo</Badge>
<Badge variant="outline">Contorno</Badge>
```

### Componentes de Estado

#### Loading Spinner
```tsx
import { LoadingSpinner, PageLoading, ButtonLoading } from '@/components/ui/loading-spinner';

// Spinner básico
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />

// Loading de página inteira
<PageLoading message="Carregando dashboard..." />

// Loading em botão
<ButtonLoading isLoading={true}>Salvar</ButtonLoading>
```

#### Skeleton
```tsx
import { 
  KPISkeleton, 
  ChartSkeleton, 
  TableSkeleton, 
  ActivitySkeleton 
} from '@/components/ui/skeleton-enhanced';

// Skeletons específicos
<KPISkeleton />
<ChartSkeleton />
<TableSkeleton rows={5} />
<ActivitySkeleton count={3} />
```

#### Estados de Erro
```tsx
import { PageError, CardError, InlineError } from '@/components/ui/error-state';

// Erro de página inteira
<PageError 
  type="network" 
  onRetry={() => window.location.reload()} 
/>

// Erro em card
<CardError 
  type="server" 
  onRetry={handleRetry} 
/>

// Erro inline
<InlineError 
  type="validation" 
  message="Campo obrigatório" 
/>
```

#### Estados Vazios
```tsx
import { PageEmpty, CardEmpty, TableEmpty, ListEmpty } from '@/components/ui/empty-state-enhanced';

// Estado vazio de página
<PageEmpty 
  type="clients" 
  action={{ label: "Cadastrar Cliente", onClick: handleAddClient }} 
/>

// Estado vazio em tabela
<TableEmpty 
  type="search" 
  searchTerm="termo pesquisado" 
/>
```

### Componentes de Formulário

#### Input
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">E-mail</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="seu@email.com" 
  />
</div>
```

#### Select
```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

### Componentes de Navegação

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Aba 1</TabsTrigger>
    <TabsTrigger value="tab2">Aba 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo da Aba 1</TabsContent>
  <TabsContent value="tab2">Conteúdo da Aba 2</TabsContent>
</Tabs>
```

#### Breadcrumb
```tsx
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Clientes</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Componentes de Feedback

#### Toast
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Toast de sucesso
toast({
  title: "Sucesso!",
  description: "Cliente cadastrado com sucesso.",
  variant: "default"
});

// Toast de erro
toast({
  title: "Erro!",
  description: "Falha ao cadastrar cliente.",
  variant: "destructive"
});
```

#### Dialog
```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Dialog</DialogTitle>
      <DialogDescription>
        Descrição do dialog
      </DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

## ♿ Acessibilidade

### Recursos Implementados

- **Skip Links**: Navegação rápida por teclado
- **ARIA Labels**: Descrições para leitores de tela
- **Focus Management**: Foco visível e lógico
- **Live Regions**: Anúncios dinâmicos
- **Semantic HTML**: Estrutura semântica correta
- **Keyboard Navigation**: Navegação completa por teclado
- **Color Contrast**: Contraste adequado (WCAG AA)

### Componentes de Acessibilidade

```tsx
import { 
  SkipLinks, 
  useFocusManagement, 
  LiveRegion, 
  AccessibleLoading 
} from '@/components/ui/skip-links';

// Skip links
<SkipLinks />

// Hook para gerenciar foco
const { focusElement, announceLiveRegion } = useFocusManagement();

// Região live
<LiveRegion message="Dados atualizados" priority="polite" />

// Loading acessível
<AccessibleLoading isLoading={loading} loadingText="Carregando dados...">
  {children}
</AccessibleLoading>
```

### Classes Utilitárias

```css
/* Screen reader only */
.sr-only

/* Skip links */
.skip-link

/* Foco aprimorado */
.focus-visible-enhanced

/* Alto contraste */
.high-contrast

/* Área de toque mínima */
.touch-target

/* Texto legível */
.text-readable
```

## 🌙 Dark Mode

O sistema suporta dark mode automático baseado na preferência do sistema ou controle manual.

### Implementação

```tsx
// Toggle manual
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};

// Classes condicionais
<div className="bg-background text-foreground">
  {/* Conteúdo que se adapta automaticamente */}
</div>
```

## 📱 Responsividade

Todos os componentes são responsivos por padrão, seguindo os breakpoints do Tailwind:

- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+
- **2xl**: 1536px+

## 🚀 Como Usar

### Instalação

Os componentes já estão configurados no projeto. Para usar:

```tsx
import { Button, Card, Badge } from '@/components/ui';
```

### Customização

Para customizar cores ou estilos:

1. Edite `tailwind.config.ts` para tokens globais
2. Edite `globals.css` para variáveis CSS
3. Use `cn()` para classes condicionais

```tsx
import { cn } from '@/lib/utils';

<Button className={cn(
  "custom-class",
  isActive && "bg-primary",
  isDisabled && "opacity-50"
)}>
  Botão Customizado
</Button>
```

## 📋 Checklist de Qualidade

### ✅ Implementado

- [x] Tokens de design consistentes
- [x] Componentes base do shadcn/ui
- [x] Estados de loading, erro e vazio
- [x] Acessibilidade (WCAG AA)
- [x] Dark mode
- [x] Responsividade
- [x] TypeScript completo
- [x] Documentação

### 🔄 Melhorias Futuras

- [ ] Testes automatizados
- [ ] Storybook
- [ ] Animações avançadas
- [ ] Temas customizáveis
- [ ] Componentes de data/calendário
- [ ] Componentes de upload

## 🤝 Contribuição

Para adicionar novos componentes:

1. Siga os padrões do shadcn/ui
2. Implemente acessibilidade
3. Adicione TypeScript
4. Documente o uso
5. Teste responsividade
6. Exporte no `index.ts`

---

**PetGet Design System** - Construído com ❤️ para gestão veterinária moderna.