import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL || 'http://localhost:3100/graphql',
});

const authLink = setContext((_, prevContext) => {
    let token: string | null = null;
    try {
        token = localStorage.getItem('token');
        // トークンの検証
        if (token && !token.startsWith('eyJ')) {
            console.warn('不正なトークンが設定されてます');
            localStorage.removeItem('token');
            token = null;
        }
    } catch (error) {
        console.error('localStrageアクセスに失敗：', error);
    }
    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;