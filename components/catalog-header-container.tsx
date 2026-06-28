import { CatalogHeader } from '@/components/catalog-header'
import { AdminIcon } from '@/components/admin-icon'

interface CatalogHeaderContainerProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CatalogHeaderContainer({ searchQuery, onSearchChange }: CatalogHeaderContainerProps) {
  return (
    <>
      <CatalogHeader 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange}
        adminIcon={<AdminIcon />}
      />
    </>
  )
}
