import { type APIResponse } from "./api"

//* 1- Article Service Arguments Types 
export type ArticleInfo = {
    token: {
        token: string
    }
    id: {
        id: number
        token: string
    }
    idPublishment: {
        id: number
        is_publish: boolean
        token: string 
    }
    data: {
        name: string
        image: string
        title: string
        keywords: string
        description: string
        token: string
    }
    idData: {
        id: number
        name: string
        image: string
        title: string
        keywords: string
        description: string
        token: string
    }
    fullData: {
        id: number
        user_id: number
        name: string
        title: string
        keywords: string
        description: string
        image: string | null
        is_publish: boolean
        created_at: string  //Type of string due to the way that mysql returns the value
        updated_at: string  //Type of string due to the way that mysql returns the value
    }
}

//* 2- Article Service Return Types 
export type ArticleResponse = {
    noData: APIResponse<null>
    data: APIResponse< ArticleInfo['fullData'] >
}

//* 3- Article Service Interface 
export interface IArticle {
    url: string
    getData: ({ token }: ArticleInfo['token']) => Promise< ArticleResponse['data'] >
    changePublishment: ({ id, is_publish, token }: ArticleInfo['idPublishment']) => Promise< ArticleResponse['noData'] >
    changeData: ({ id, name, image, title, keywords, description, token }: ArticleInfo['idData']) => Promise< ArticleResponse['noData'] >
    insertNew:  ({ name, image, title, keywords, description, token }: ArticleInfo['data']) => Promise< ArticleResponse['noData'] >
    removeData: ({ id, token }: ArticleInfo['id']) => Promise< ArticleResponse['noData'] >
}