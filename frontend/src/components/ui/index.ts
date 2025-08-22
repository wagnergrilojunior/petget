// Componentes base do shadcn/ui
export { Button, buttonVariants } from "./button"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card"

export { Input } from "./input"
export { PasswordInput } from "./password-input"
export { Label } from "./label"

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"

export { Avatar, AvatarImage, AvatarFallback } from "./avatar"
export { Badge } from "./badge"
export { Skeleton } from "./skeleton"
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport } from "./navigation-menu"

// Componentes personalizados do PetGet
export { Badge as EnhancedBadge, StatusBadges, badgeVariants } from "./enhanced-badge"
export type { BadgeProps } from "./enhanced-badge"

export { EmptyState, EmptyStates } from "./empty-state"

export {
  LoadingSpinner,
  PageLoading,
  OverlayLoading,
  ButtonLoading,
  CardLoading
} from "./loading-spinner"

export {
  KPISkeleton,
  ChartSkeleton,
  TableSkeleton,
  ActivitySkeleton,
  FormSkeleton,
  ProductCardSkeleton,
  ProfileSkeleton,
  DashboardSkeleton
} from "./skeleton-enhanced"

export {
  ErrorState,
  PageError,
  CardError,
  InlineError
} from "./error-state"

export {
  EmptyState as EmptyStateEnhanced,
  PageEmpty,
  CardEmpty,
  TableEmpty,
  ListEmpty
} from "./empty-state-enhanced"

export {
  SkipLinks,
  useFocusManagement,
  LiveRegion,
  AccessibleLoading
} from "./skip-links"

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastWithIcon,
} from "./toast"
export type { ToastProps, ToastActionElement } from "./toast"

export { DataTable } from "./data-table"