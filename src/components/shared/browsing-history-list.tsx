'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import ProductSlider from '@/components/shared/product/product-slider'
import { Separator } from '@/components/ui/separator'
import {cn} from '@/lib/utils'

export default function BrowsingHistoryList({
    className,
}: {
    className?: string
    }) {
    const { products } = useBrowsingHistory()
    return (
        products.length !== 0 && (
            <div className='bg-background'>
                <div className={cn('mb-4', className)} />
                <ProductList
                title={"Related to items that you've viewed"}
                type='related'
                />
                <Separator className='my-4' />
                <ProductList
                title={'Your browsing history'}
                hideDetails
                type='history'
                />
            </div>
        )
    )
}

function ProductList({
    title,
    type = 'history',
    hideDetails,
}: {
    title: string
    type?: 'related' | 'history'
    hideDetails?: boolean
    }) {
    const { products } = useBrowsingHistory()
    const [data, setData] = React.useState([])
    useEffect(() => {
const FetchProducts = async () => {
    const res = await fetch(
        `/api/products/browsing-history?type=${type}&categories=${products
        .map((product) => product.category)
        .join(',')}&ids=${products.map((product) => product.id).join(',')}`
        )
    const data = await res.json()
    setData(data)
    }
    FetchProducts()
    }, [products, type])
return (
    data.length > 0 && (
    <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
)
}


