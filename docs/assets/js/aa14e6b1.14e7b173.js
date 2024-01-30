"use strict";(self.webpackChunkrxdb=self.webpackChunkrxdb||[]).push([[933],{8439:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>o,toc:()=>c});var r=t(5893),i=t(1151);const a={title:"GraphQL Replication",slug:"replication-graphql.html"},s="Replication with GraphQL",o={id:"replication-graphql",title:"GraphQL Replication",description:"The GraphQL replication provides handlers for GraphQL to run replication with GraphQL as the transportation layer.",source:"@site/docs/replication-graphql.md",sourceDirName:".",slug:"/replication-graphql.html",permalink:"/replication-graphql.html",draft:!1,unlisted:!1,editUrl:"https://github.com/pubkey/rxdb/tree/master/docs-src/docs/replication-graphql.md",tags:[],version:"current",frontMatter:{title:"GraphQL Replication",slug:"replication-graphql.html"},sidebar:"tutorialSidebar",previous:{title:"RxDB Server Replication",permalink:"/replication-server"},next:{title:"Websocket Replication",permalink:"/replication-websocket.html"}},l={},c=[{value:"Usage",id:"usage",level:2},{value:"Creating a compatible GraphQL Server",id:"creating-a-compatible-graphql-server",level:3},{value:"RxDB Client",id:"rxdb-client",level:3},{value:"Pull replication",id:"pull-replication",level:4},{value:"Push replication",id:"push-replication",level:4},{value:"Pull Stream",id:"pull-stream",level:4},{value:"Transforming null to undefined in optional fields",id:"transforming-null-to-undefined-in-optional-fields",level:3},{value:"pull.responseModifier",id:"pullresponsemodifier",level:3},{value:"push.responseModifier",id:"pushresponsemodifier",level:3},{value:"Helper Functions",id:"helper-functions",level:4},{value:"RxGraphQLReplicationState",id:"rxgraphqlreplicationstate",level:3},{value:".setHeaders()",id:"setheaders",level:4},{value:"Sending Cookies",id:"sending-cookies",level:4}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"replication-with-graphql",children:"Replication with GraphQL"}),"\n",(0,r.jsxs)(n.p,{children:["The GraphQL replication provides handlers for GraphQL to run ",(0,r.jsx)(n.a,{href:"/replication.html",children:"replication"})," with GraphQL as the transportation layer."]}),"\n",(0,r.jsxs)(n.p,{children:["The GraphQL replication is mostly used when you already have a backend that exposes a GraphQL API that can be adjusted to serve as a replication endpoint. If you do not already have a GraphQL endpoint, using the ",(0,r.jsx)(n.a,{href:"/replication-http.html",children:"HTTP replication"})," is an easier solution."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"NOTICE:"})," To play around, check out the full example of the RxDB ",(0,r.jsx)(n.a,{href:"https://github.com/pubkey/rxdb/tree/master/examples/graphql",children:"GraphQL replication with server and client"})]}),"\n",(0,r.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsxs)(n.p,{children:["Before you use the GraphQL replication, make sure you've learned how the ",(0,r.jsx)(n.a,{href:"/replication.html",children:"RxDB replication"})," works."]}),"\n",(0,r.jsx)(n.h3,{id:"creating-a-compatible-graphql-server",children:"Creating a compatible GraphQL Server"}),"\n",(0,r.jsxs)(n.p,{children:["At the server-side, there must exist an endpoint which returns newer rows when the last ",(0,r.jsx)(n.code,{children:"checkpoint"})," is used as input. For example lets say you create a ",(0,r.jsx)(n.code,{children:"Query"})," ",(0,r.jsx)(n.code,{children:"pullHuman"})," which returns a list of document writes that happened after the given checkpoint."]}),"\n",(0,r.jsxs)(n.p,{children:["For the push-replication, you also need a ",(0,r.jsx)(n.code,{children:"Mutation"})," ",(0,r.jsx)(n.code,{children:"pushHuman"})," which lets RxDB update data of documents by sending the previous document state and the new client document state.\nAlso for being able to stream all ongoing events, we need a ",(0,r.jsx)(n.code,{children:"Subscription"})," called ",(0,r.jsx)(n.code,{children:"streamHuman"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-graphql",children:"input HumanInput {\n    id: ID!,\n    name: String!,\n    lastName: String!,\n    updatedAt: Float!,\n    deleted: Boolean!\n}\ntype Human {\n    id: ID!,\n    name: String!,\n    lastName: String!,\n    updatedAt: Float!,\n    deleted: Boolean!\n}\ninput Checkpoint {\n    id: String!,\n    updatedAt: Float!\n}\ntype HumanPullBulk {\n    documents: [Human]!\n    checkpoint: Checkpoint\n}\n\ntype Query {\n    pullHuman(checkpoint: Checkpoint, limit: Int!): HumanPullBulk!\n}\n\ninput HumanInputPushRow {\n    assumedMasterState: HeroInputPushRowT0AssumedMasterStateT0\n    newDocumentState: HeroInputPushRowT0NewDocumentStateT0!\n}\n\ntype Mutation {\n    # Returns a list of all conflicts\n    # If no document write caused a conflict, return an empty list.\n    pushHuman(rows: [HumanInputPushRow!]): [Human]\n}\n\n# headers are used to authenticate the subscriptions\n# over websockets.\ninput Headers {\n    AUTH_TOKEN: String!;\n}\ntype Subscription {\n    streamHuman(headers: Headers): HumanPullBulk!\n}\n\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The GraphQL resolver for the ",(0,r.jsx)(n.code,{children:"pullHuman"})," would then look like:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const rootValue = {\n    pullHuman: args => {\n        const minId = args.checkpoint ? args.checkpoint.id : '';\n        const minUpdatedAt = args.checkpoint ? args.checkpoint.updatedAt : 0;\n\n        // sorted by updatedAt first and the id as second\n        const sortedDocuments = documents.sort((a, b) => {\n            if (a.updatedAt > b.updatedAt) return 1;\n            if (a.updatedAt < b.updatedAt) return -1;\n            if (a.updatedAt === b.updatedAt) {\n                if (a.id > b.id) return 1;\n                if (a.id < b.id) return -1;\n            else return 0;\n            }\n        });\n\n        // only return documents newer than the input document\n        const filterForMinUpdatedAtAndId = sortedDocuments.filter(doc => {\n            if (doc.updatedAt < minUpdatedAt) return false;\n            if (doc.updatedAt > minUpdatedAt) return true;\n            if (doc.updatedAt === minUpdatedAt) {\n                // if updatedAt is equal, compare by id\n                if (doc.id > minId) return true;\n                else return false;\n            }\n        });\n\n        // only return some documents in one batch\n        const limitedDocs = filterForMinUpdatedAtAndId.slice(0, args.limit);\n\n        // use the last document for the checkpoint\n        const lastDoc = limitedDocs[limitedDocs.length - 1];\n        const retCheckpoint = {\n            id: lastDoc.id,\n            updatedAt: lastDoc.updatedAt\n        }\n\n        return {\n            documents: limitedDocs,\n            checkpoint: retCheckpoint\n        }\n\n        return limited;\n    }\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["For examples for the other resolvers, consult the ",(0,r.jsx)(n.a,{href:"https://github.com/pubkey/rxdb/blob/master/examples/graphql/server/index.js",children:"GraphQL Example Project"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"rxdb-client",children:"RxDB Client"}),"\n",(0,r.jsx)(n.h4,{id:"pull-replication",children:"Pull replication"}),"\n",(0,r.jsxs)(n.p,{children:["For the pull-replication, you first need a ",(0,r.jsx)(n.code,{children:"pullQueryBuilder"}),". This is a function that gets the last replication ",(0,r.jsx)(n.code,{children:"checkpoint"})," and a ",(0,r.jsx)(n.code,{children:"limit"})," as input and returns an object with a GraphQL-query and its variables (or a promise that resolves to the same object). RxDB will use the query builder to construct what is later sent to the GraphQL endpoint."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const pullQueryBuilder = (checkpoint, limit) => {\n    /**\n     * The first pull does not have a checkpoint\n     * so we fill it up with defaults\n     */\n    if (!checkpoint) {\n        checkpoint = {\n            id: '',\n            updatedAt: 0\n        };\n    }\n    const query = `query PullHuman($checkpoint: CheckpointInput, $limit: Int!) {\n        pullHuman(checkpoint: $checkpoint, limit: $limit) {\n            documents {\n                id\n                name\n                age\n                updatedAt\n                deleted\n            }\n            checkpoint {\n                id\n                updatedAt\n            }\n        }\n    }`;\n    return {\n        query,\n        operationName: 'PullHuman',\n        variables: {\n            checkpoint,\n            limit\n        }\n    };\n};\n"})}),"\n",(0,r.jsx)(n.p,{children:"With the queryBuilder, you can then setup the pull-replication."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';\nconst replicationState = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        // urls to the GraphQL endpoints\n        url: {\n            http: 'http://example.com/graphql'\n        },\n        pull: {\n            queryBuilder: pullQueryBuilder, // the queryBuilder from above\n            modifier: doc => doc, // (optional) modifies all pulled documents before they are handled by RxDB\n            dataPath: undefined, // (optional) specifies the object path to access the document(s). Otherwise, the first result of the response data is used.\n            /**\n             * Amount of documents that the remote will send in one request.\n             * If the response contains less then [batchSize] documents,\n             * RxDB will assume there are no more changes on the backend\n             * that are not replicated.\n             * This value is the same as the limit in the pullHuman() schema.\n             * [default=100]\n             */\n            batchSize: 50\n        },\n        // headers which will be used in http requests against the server.\n        headers: {\n            Authorization: 'Bearer abcde...'\n        },\n\n        /**\n         * Options that have been inherited from the RxReplication\n         */\n        deletedField: 'deleted',\n        live: true,\n        retryTime = 1000 * 5,\n        waitForLeadership = true,\n        autoStart = true,\n    }\n);\n"})}),"\n",(0,r.jsx)(n.h4,{id:"push-replication",children:"Push replication"}),"\n",(0,r.jsxs)(n.p,{children:["For the push-replication, you also need a ",(0,r.jsx)(n.code,{children:"queryBuilder"}),". Here, the builder receives a changed document as input which has to be send to the server. It also returns a GraphQL-Query and its data."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const pushQueryBuilder = rows => {\n    const query = `\n    mutation PushHuman($writeRows: [HumanInputPushRow!]) {\n        pushHuman(writeRows: $writeRows) {\n            id\n            name\n            age\n            updatedAt\n            deleted\n        }\n    }\n    `;\n    const variables = {\n        writeRows: rows\n    };\n    return {\n        query,\n        operationName: 'PushHuman',\n        variables\n    };\n};\n"})}),"\n",(0,r.jsx)(n.p,{children:"With the queryBuilder, you can then setup the push-replication."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const replicationState = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        // urls to the GraphQL endpoints\n        url: {\n            http: 'http://example.com/graphql'\n        },\n        push: {\n            queryBuilder: pushQueryBuilder, // the queryBuilder from above\n            /**\n             * batchSize (optional)\n             * Amount of document that will be pushed to the server in a single request.\n             */\n            batchSize: 5,\n            /**\n             * modifier (optional)\n             * Modifies all pushed documents before they are send to the GraphQL endpoint.\n             * Returning null will skip the document.\n             */\n            modifier: doc => doc\n        },\n        headers: {\n            Authorization: 'Bearer abcde...'\n        },\n        pull: {\n            /* ... */\n        },\n        /* ... */\n    }\n);\n"})}),"\n",(0,r.jsx)(n.h4,{id:"pull-stream",children:"Pull Stream"}),"\n",(0,r.jsxs)(n.p,{children:["To create a ",(0,r.jsx)(n.strong,{children:"realtime"})," replication, you need to create a pull stream that pulls ongoing writes from the server.\nThe pull stream gets the ",(0,r.jsx)(n.code,{children:"headers"})," of the ",(0,r.jsx)(n.code,{children:"RxReplicationState"})," as input, so that it can be authenticated on the backend."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const pullStreamQueryBuilder = (headers) => {\n    const query = `subscription onStream($headers: Headers) {\n        streamHero(headers: $headers) {\n            documents {\n                id,\n                name,\n                age,\n                updatedAt,\n                deleted\n            },\n            checkpoint {\n                id\n                updatedAt\n            }\n        }\n    }`;\n    return {\n        query,\n        variables: {\n            headers\n        }\n    };\n};\n"})}),"\n",(0,r.jsxs)(n.p,{children:["With the ",(0,r.jsx)(n.code,{children:"pullStreamQueryBuilder"})," you can then start a realtime replication."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const replicationState = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        // urls to the GraphQL endpoints\n        url: {\n            http: 'http://example.com/graphql',\n            ws: 'ws://example.com/subscriptions' // <- The websocket has to use a different url.\n        },\n        push: {\n            batchSize: 100,\n            queryBuilder: pushQueryBuilder\n        },\n        headers: {\n            Authorization: 'Bearer abcde...'\n        },\n        pull: {\n            batchSize: 100,\n            queryBuilder: pullQueryBuilder,\n            streamQueryBuilder: pullStreamQueryBuilder,\n            includeWsHeaders: false, // Includes headers as connection parameter to Websocket.\n        },\n        deletedField: 'deleted'\n    }\n);\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"NOTICE"}),": If it is not possible to create a websocket server on your backend, you can use any other method of pull out the ongoing events from the backend and then you can send them into ",(0,r.jsx)(n.code,{children:"RxReplicationState.emitEvent()"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"transforming-null-to-undefined-in-optional-fields",children:"Transforming null to undefined in optional fields"}),"\n",(0,r.jsxs)(n.p,{children:["GraphQL fills up non-existent optional values with ",(0,r.jsx)(n.code,{children:"null"})," while RxDB required them to be ",(0,r.jsx)(n.code,{children:"undefined"}),".\nTherefore, if your schema contains optional properties, you have to transform the pulled data to switch out ",(0,r.jsx)(n.code,{children:"null"})," to ",(0,r.jsx)(n.code,{children:"undefined"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const replicationState: RxGraphQLReplicationState<RxDocType> = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        url: {/* ... */},\n        headers: {/* ... */},\n        push: {/* ... */},\n        pull: {\n            queryBuilder: pullQueryBuilder,\n            modifier: (doc => {\n                // We have to remove optional non-existent field values\n                // they are set as null by GraphQL but should be undefined\n                Object.entries(doc).forEach(([k, v]) => {\n                    if (v === null) {\n                        delete doc[k];\n                    }\n                });\n                return doc;\n            })\n        },\n        /* ... */\n    }\n);\n"})}),"\n",(0,r.jsx)(n.h3,{id:"pullresponsemodifier",children:"pull.responseModifier"}),"\n",(0,r.jsxs)(n.p,{children:["With the ",(0,r.jsx)(n.code,{children:"pull.responseModifier"})," you can modify the whole response from the GraphQL endpoint ",(0,r.jsx)(n.strong,{children:"before"})," it is processed by RxDB.\nFor example if your endpoint is not capable of returning a valid checkpoint, but instead only returns the plain document array, you can use the ",(0,r.jsx)(n.code,{children:"responseModifier"})," to aggregate the checkpoint from the returned documents."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import {\n\n} from 'rxdb';\nconst replicationState: RxGraphQLReplicationState<RxDocType> = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        url: {/* ... */},\n        headers: {/* ... */},\n        push: {/* ... */},\n        pull: {\n            responseModifier: async function(\n                plainResponse, // the exact response that was returned from the server\n                origin, // either 'handler' if plainResponse came from the pull.handler, or 'stream' if it came from the pull.stream\n                requestCheckpoint // if origin==='handler', the requestCheckpoint contains the checkpoint that was send to the backend\n            ) {\n                /**\n                 * In this example we aggregate the checkpoint from the documents array\n                 * that was returned from the graphql endpoint.\n                 */\n                const docs = plainResponse;\n                return {\n                    documents: docs,\n                    checkpoint: docs.length === 0 ? requestCheckpoint : {\n                        name: lastOfArray(docs).name,\n                        updatedAt: lastOfArray(docs).updatedAt\n                    }\n                };\n            }\n        },\n        /* ... */\n    }\n);\n"})}),"\n",(0,r.jsx)(n.h3,{id:"pushresponsemodifier",children:"push.responseModifier"}),"\n",(0,r.jsx)(n.p,{children:"It's also possible to modify the response of a push mutation. For example if your server returns more than the just conflicting docs:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-graphql",children:"type PushResponse {\n    conflicts: [Human]\n    conflictMessages: [ReplicationConflictMessage]\n}\n\ntype Mutation {\n    # Returns a PushResponse type that contains the conflicts along with other information\n    pushHuman(rows: [HumanInputPushRow!]): PushResponse!\n}\n"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:'import {} from "rxdb";\nconst replicationState: RxGraphQLReplicationState<RxDocType> = replicateGraphQL(\n    {\n        collection: myRxCollection,\n        url: {/* ... */},\n        headers: {/* ... */},\n        push: {\n            responseModifier: async function (plainResponse) {\n                /**\n                 * In this example we aggregate the conflicting documents from a response object\n                 */\n                return plainResponse.conflicts;\n            },\n        },\n        pull: {/* ... */},\n        /* ... */\n    }\n);\n'})}),"\n",(0,r.jsx)(n.h4,{id:"helper-functions",children:"Helper Functions"}),"\n",(0,r.jsxs)(n.p,{children:["RxDB provides the helper functions ",(0,r.jsx)(n.code,{children:"graphQLSchemaFromRxSchema()"}),", ",(0,r.jsx)(n.code,{children:"pullQueryBuilderFromRxSchema()"}),", ",(0,r.jsx)(n.code,{children:"pullStreamBuilderFromRxSchema()"})," and ",(0,r.jsx)(n.code,{children:"pushQueryBuilderFromRxSchema()"})," that can be used to generate handlers and schemas from the ",(0,r.jsx)(n.code,{children:"RxJsonSchema"}),". To learn how to use them, please inspect the ",(0,r.jsx)(n.a,{href:"https://github.com/pubkey/rxdb/tree/master/examples/graphql",children:"GraphQL Example"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"rxgraphqlreplicationstate",children:"RxGraphQLReplicationState"}),"\n",(0,r.jsxs)(n.p,{children:["When you call ",(0,r.jsx)(n.code,{children:"myCollection.syncGraphQL()"})," it returns a ",(0,r.jsx)(n.code,{children:"RxGraphQLReplicationState"})," which can be used to subscribe to events, for debugging or other functions. It extends the ",(0,r.jsx)(n.a,{href:"/replication.html",children:"RxReplicationState"})," with some GraphQL specific methods."]}),"\n",(0,r.jsx)(n.h4,{id:"setheaders",children:".setHeaders()"}),"\n",(0,r.jsx)(n.p,{children:"Changes the headers for the replication after it has been set up."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"replicationState.setHeaders({\n    Authorization: `...`\n});\n"})}),"\n",(0,r.jsx)(n.h4,{id:"sending-cookies",children:"Sending Cookies"}),"\n",(0,r.jsxs)(n.p,{children:["The underlying fetch framework uses a ",(0,r.jsx)(n.code,{children:"same-origin"})," policy for credentials per default. That means, cookies and session data is only shared if you backend and frontend run on the same domain and port. Pass the credential parameter to ",(0,r.jsx)(n.code,{children:"include"})," cookies in requests to servers from different origins via:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"replicationState.setCredentials('include');\n"})}),"\n",(0,r.jsxs)(n.p,{children:["or directly pass it in the the ",(0,r.jsx)(n.code,{children:"syncGraphQL"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"replicateGraphQL(\n    {\n        collection: myRxCollection,\n        /* ... */\n        credentials: 'include',\n        /* ... */\n    }\n);\n"})}),"\n",(0,r.jsxs)(n.p,{children:["See ",(0,r.jsx)(n.a,{href:"https://fetch.spec.whatwg.org/#concept-request-credentials-mode",children:"the fetch spec"})," for more information about available options."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"NOTICE:"})," To play around, check out the full example of the RxDB ",(0,r.jsx)(n.a,{href:"https://github.com/pubkey/rxdb/tree/master/examples/graphql",children:"GraphQL replication with server and client"})]})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>s});var r=t(7294);const i={},a=r.createContext(i);function s(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);