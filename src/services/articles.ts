import { URL } from "url"
import type { IArticle, ArticleInfo, ArticleResponse } from "../types/articles"

export class Article implements IArticle {
    url: URL

    constructor(ARTICLE_URL: URL) {
        this.url = ARTICLE_URL
    }

    getData = async () => {
        const response = await fetch(this.url)
        return await response.json() as ArticleResponse['data']
    }

    changeName = async ({ id, name }: ArticleInfo['idName']) => {
        const url = new URL('/name', this.url)

        const options = {
            method: 'PATCH',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({ id, name })
        }

        const response = await fetch(url, options)
        return await response.json() as ArticleResponse['noData']
    }
    
    changeDescription = async ({ id, description }: ArticleInfo['idDescription']) => {
        const url = new URL('/description', this.url)

        const options = {
            method: 'PATCH',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({ id, description })
        }

        const response = await fetch(url, options)
        return await response.json() as ArticleResponse['noData']
    }
    
    changePublishment = async ({ id, is_publish }: ArticleInfo['idPublishment']) => {
        const url = new URL('/publishment', this.url)

        const options = {
            method: 'PATCH',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({ id, is_publish })
        }

        const response = await fetch(url, options)
        return await response.json() as ArticleResponse['noData']
    }
    
    insertNew = async ({ name }: ArticleInfo['name']) => {
        const options = {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({ name })
        }

        const response = await fetch(this.url, options)
        return await response.json() as ArticleResponse['noData']
    }
    
    removeData = async ({ id }: ArticleInfo['id']) => {
        const options = {
            method: 'DELETE',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({ id })
        }

        const response = await fetch(this.url, options)
        return await response.json() as ArticleResponse['noData']
    }
}