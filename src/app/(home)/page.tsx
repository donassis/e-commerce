import {HomeCarousel} from '@/components/shared/home/home-carousel'
import {HomeCard} from '@/components/shared/home/home-card'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import {getAllCategories, getProductsForCard, getProductsByTag} from '@/lib/actions/product.actions'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

export default async function Page() {
    const categories = (await getAllCategories()).slice(0, 4)
    const newArrivals = await getProductsForCard({tag: 'new-arrivals', limit: 4})
    const featured = await getProductsForCard({tag: 'featured', limit: 4})
    const bestSellers = await getProductsForCard({tag: 'best-sellers', limit: 4})

    const todaysDeals = await getProductsByTag({tag: 'todays-deal'})
    const bestSellingProducts = await getProductsByTag({tag: 'best-seller'})

    const cards = [
        {
            title: 'Categories to Explore',
            link: {
                text: 'See More',
                href: '/search',
            },
            items: categories.map((category) => ({
                name: category,
                image: `/images/${toSlug(category)}.jpg`,
                href: `/search?category=${category}`
                })),
            },
            {
                title: 'Explore New Arrivals',
                items: newArrivals,
                link: {
                    text: 'See More',
                    href: '/search?tag=new-arrival',
                },
            },
        {
            title: 'Discover Best Sellers',
            items: bestSellers,
            link: {
              text: 'View All',
              href: '/search?tag=best-seller',
            },
          },
          {
            title: 'Featured Products',
            items: featured,
            link: {
              text: 'Shop Now',
              href: '/search?tag=new-arrival',
            },
          }
      ]

    return (
        <>
          <HomeCarousel items={data.carousels} />
          <div className='md:p-4 md:space-y-4 bg-border'>
            <HomeCard cards={cards} />

            <Card className='w-full rounded-none'>
              <CardContent className='p-4 items-center gap-3'>
                <ProductSlider title={"Today's Deals"} products={todaysDeals} />
              </CardContent>
            </Card>

            <Card className='w-full rounded-none'>
             <CardContent className='p-4 items-center gap-3'>
                 <ProductSlider
                 title='Best Seller Products'
                 products={bestSellingProducts}
                 hideDetails
                 />
                </CardContent>
            </Card>
          </div>
          <div className='p-4 bg-background'>
          <BrowsingHistoryList />
          </div>
        </>
      )
}

