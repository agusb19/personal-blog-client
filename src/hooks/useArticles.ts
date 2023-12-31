import toast from 'react-hot-toast'
import { Article } from '../services/articles'
import { useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAPIStore } from '../stores/api'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { type ArticleInfo } from '../types/articles'

const articleService = new Article()
const TOAST_ID_QUERY = 'ARTICLE_TOAST_QUERY'
const TOAST_ID_MUTATE = 'ARTICLE_TOAST_MUTATE'

export const useArticleData = () => {

    const userToken = useAPIStore(state => state.userToken)

    const { data, isPending, isLoading, isError, refetch } = useQuery({
        queryKey: ['article', 'data', userToken],
        queryFn: ({ queryKey }) => articleService.getData({ token: queryKey[2] }),
        staleTime: Infinity
    })

    useEffect(() => {
        
        if(isLoading) {
            toast.loading('Requesting API', { id: TOAST_ID_QUERY })
        }
        
        if(isError) {
            toast.error('Internal error, please try again', { id: TOAST_ID_QUERY })
        }
        
        if(!isError && !isLoading && !isPending && !data.success) {
            toast.error(`Api message: ${data.error.message}`,  
                { 
                    id: TOAST_ID_QUERY, 
                    style: { minWidth: '380px' } 
                }
            )
        }

        if(!isError && !isLoading && !isPending && data.success) {
            toast.success(
                `Api message: ${data.result.message}`, 
                { 
                    id: TOAST_ID_QUERY, 
                    style: { minWidth: '360px' } 
                }
            )
        } 

    }, [isPending, isLoading, isError, data])

    return {
        articleData: data?.success ? data.result.data : [],
        refetchArticles: refetch
    }
}

export const useArticleAdd = ({ cleanModal }: { cleanModal: () => void }) => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const userToken = useAPIStore(state => state.userToken)

    const { mutate, isPending } = useMutation({
        mutationKey: ['article', 'addNew'],
        mutationFn: articleService.insertNew,

        onMutate: () => {
            toast.loading('Requesting API', { id: TOAST_ID_MUTATE })
        },
        onError: () => {
            toast.error('Internal error, please try again', { id: TOAST_ID_MUTATE })
        },
        onSuccess: async (data, variables) => {
            data.success
                ? toast.success(
                    `Api message: ${data.result.message}`, 
                    { 
                        id: TOAST_ID_MUTATE, 
                        style: { minWidth: '400px' } 
                    }
                )
                : toast.error(`Api message: ${data.error.message}`,  { id: TOAST_ID_MUTATE })

            data.success && cleanModal()
            data.success && navigate(`/dashboard/edit/${variables.name.replace(/\s/g, "-")}`)
            data.success && queryClient.invalidateQueries({ queryKey: ['article', 'data'] })
        }
    })    

    const addNewArticle = (data: Omit<ArticleInfo['data'], "token">) => {
        mutate({ token: userToken, ...data })
    }

    return {
        addNewArticle,
        isPending
    }
}

export const useArticleDelete = () => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const userToken = useAPIStore(state => state.userToken)
    const articleId = useAPIStore(state => state.articleId)
    
    const { mutate, isPending } = useMutation({
        mutationKey: ['article', 'delete'],
        mutationFn: articleService.removeData,

        onMutate: () => {
            toast.loading('Requesting API', { id: TOAST_ID_MUTATE })
        },
        onError: () => {
            toast.error('Internal error, please try again', { id: TOAST_ID_MUTATE })
        },
        onSuccess: async (data) => {
            data.success
                ? toast.success(
                    `Api message: ${data.result.message}`, 
                    { 
                        id: TOAST_ID_MUTATE, 
                        style: { minWidth: '400px' } 
                    }
                )
                : toast.error(`Api message: ${data.error.message}`,  { id: TOAST_ID_MUTATE })

            data.success && navigate('/dashboard/create/new-article')
            data.success && queryClient.invalidateQueries({ queryKey: ['article', 'data'] })
        }
    })

    const deleteArticle = () => {
        const id = Number(articleId)

        if(isNaN(id)) return 

        mutate({ id: id, token: userToken })
    }

    return {
        deleteArticle,
        isPending
    }
}

export const useArticleEdit = ({ cleanModal }: { cleanModal: () => void }) => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const userToken = useAPIStore(state => state.userToken)
    const articleId = useAPIStore(state => state.articleId)

    const { mutate, isPending } = useMutation({
        mutationKey: ['article', 'edit'],
        mutationFn: articleService.changeData,

        onMutate: () => {
            toast.loading('Requesting API', { id: TOAST_ID_MUTATE })
        },
        onError: () => {
            toast.error('Internal error, please try again', { id: TOAST_ID_MUTATE })
        },
        onSuccess: async (data, variables) => {
            data.success
                ? toast.success(
                    `Api message: ${data.result.message}`, 
                    { 
                        id: TOAST_ID_MUTATE, 
                        style: { minWidth: '400px' } 
                    }
                )
                : toast.error(`Api message: ${data.error.message}`,  { id: TOAST_ID_MUTATE })

            data.success && cleanModal()
            data.success && navigate(`/dashboard/edit/${variables.name.replace(/\s/g, "-")}`)
            data.success && queryClient.invalidateQueries({ queryKey: ['article', 'data'] })
        }
    })

    const editArticle = (data: Omit<ArticleInfo['data'], "token">) => {
        const id = Number(articleId)
        if(isNaN(id)) return 
        mutate({ id: id, token: userToken, ...data })
    }

    return {
        editArticle,
        isPending
    }
}

export const useArticlePublish = () => {

    const queryClient = useQueryClient()

    const userToken = useAPIStore(state => state.userToken)
    const articleId = useAPIStore(state => state.articleId)

    const { mutate, isPending } = useMutation({
        mutationKey: ['article', 'publish'],
        mutationFn: articleService.changePublishment,

        onMutate: () => {
            toast.loading('Requesting API', { id: TOAST_ID_QUERY })
        },
        onError: () => {
            toast.error('Internal error, please try again', { id: TOAST_ID_QUERY })
        },
        onSuccess: async (data) => {
            data.success
                ? toast.success(
                    `Api message: ${data.result.message}`, 
                    { 
                        id: TOAST_ID_QUERY, 
                        style: { minWidth: '450px' } 
                    }
                )
                : toast.error(`Api message: ${data.error.message}`,  { id: TOAST_ID_QUERY })

            data.success && queryClient.invalidateQueries({ queryKey: ['article', 'data'] })
        }
    })

    const publishArticle = (data: Pick<ArticleInfo['idPublishment'], "is_publish">) => {
        const id = Number(articleId)
        if(isNaN(id)) return 
        mutate({ id: id, token: userToken, is_publish: data.is_publish })
    }

    return {
        publishArticle,
        isPending
    }
}