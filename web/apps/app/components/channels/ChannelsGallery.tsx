import { FilterList, Gallery } from '@signalco/ui';
import { orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks';
import { channelsData, channelCategories } from '@signalco/data';
import ChannelGalleryItem from './ChannelGalleryItem';

export default function ChannelsGallery(props: { channelHrefFunc: (id: string) => string }) {
    const { channelHrefFunc } = props;
    const [category, setCategory] = useSearchParam('category');
    const selectedCategory = channelCategories.find(c => c.id == category);
    const gridItems = orderBy(
        selectedCategory
            ? channelsData.filter(i => i.categories.includes(selectedCategory.id))
            : channelsData,
        (a, b) => a.label.localeCompare(b.label)).map(gi => ({ ...gi, id: gi.channelName, hrefFunc: channelHrefFunc }));

    return (
        <Gallery
            items={gridItems}
            itemComponent={ChannelGalleryItem}
            gridHeader={selectedCategory ? `${selectedCategory?.label} channels` : 'All channels'}
            filters={() => (
                <>
                    <FilterList
                        header="Categories"
                        items={channelCategories}
                        selected={category}
                        onSelected={setCategory} />
                </>
            )} />
    );
}