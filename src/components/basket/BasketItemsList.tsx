import BasketItemCard from '@/components/basket/BasketItemCard';
import useBasketStore from 'store/store';

interface BasketItemsListProps {
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function BasketItemsList({
  onQuantityChange,
  onRemove,
}: BasketItemsListProps) {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());

  return (
    <>
      {groupedItems.map((item) => (
        <BasketItemCard
          key={item.product._id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}
