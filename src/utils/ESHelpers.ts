import { AuthenticationError } from 'apollo-server-express'
import { omit } from 'lodash'
import dotenv = require('dotenv')
import express from 'express'
import { NewRequest } from '@/interfaces/Interfaces'
import { ConfigType } from '@/typings/common'

require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')

const DEFAULT_ENV = 'development'

// Get current environment name.
const { parsed } = dotenv.config()
let env = express().get('env') || DEFAULT_ENV
// Get configuration based on the environment.
let config: ConfigType = require('@/config/' + (env || DEFAULT_ENV) + '.config').default

export default class ESHelpers {
  protected static esUrl = parsed?.ES_URL ? parsed?.ES_URL : config.esUrl
  public static esClient = new Client({ node: ESHelpers.esUrl })

  /**
   * Method: initialIndex
   *
   * Type: Static Method
   *
   * Parameters:
   * - _config: ConfigType - The configuration object for the indices.
   * - indexName: string - The name of the index to initialize.
   *
   * Description:
   * The `initialIndex` function creates an index in Elasticsearch using a specified template file.
   *
   * Operations:
   * 1. The function starts by loading the index mappings from the `@/config/indices/template.${indexName}.index.json`
   * file.
   * 2. The `exists` method of the `ESHelpers.esClient.indices` object is used to check if an index with the same name
   * already exists.
   * 3. If the index does not exist, the `create` method of the same object is used to create the index with the
   * specified name and mappings.
   * 4. The function logs success or failure messages based on the result of the create operation.
   *
   * Dependencies:
   * - ESHelpers: Object that holds Elasticsearch client instance.
   * - require: The Node.js require statement for loading the index mapping file.
   */
  static initialIndex = async (_config: ConfigType, indexName: string) => {
    const mappings = await require('@/config/indices/template.' + indexName + '.index.json')
    ESHelpers.esClient.indices
      .exists({
        index: indexName
      })
      .then((exists: boolean) => {
        console.log(`>>-----> init (new) ${indexName} exists?: `, exists)
        if (!exists) {
          ESHelpers.esClient.indices
            .create({
              index: indexName,
              ...mappings
            })
            .then(() => {
              console.info(`>>-----> init (new) ${indexName} success.`)
            })
            .catch((err: any) => {
              console.error(`>>-----> init (new) ${indexName} fail: `, err)
            })
        }
      })
  }

  /**
   * Method: getCount
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName: string - name of the index
   * - params: any - request body for count API
   *
   * Description:
   * The `getCount` method is used to get the count of documents in the specified index.
   *
   * Operations:
   * 1. Define a search body with the specified index name and the request body for count API.
   * 2. Call the `count` method on the Elasticsearch client instance with the search body as an argument.
   * 3. Return the count of documents in the index, if the request is successful.
   * 4. If an error occurs, throw an `AuthenticationError` with the error message.
   *
   * Dependencies:
   * - ESHelpers.esClient
   * - AuthenticationError
   */
  public static getCount = async (indexName: string, params: any) => {
    let searchBody: any = {
      index: indexName,
      body: params
    }
    return ESHelpers.esClient.count(searchBody).then(
      (data: any) => {
        return data.count
      },
      (err: any) => {
        throw new AuthenticationError(err)
      }
    )
  }

  /**
   * Method: get
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName (string): The name of the index to search.
   * - params (any): The search parameters.
   * - aggs (boolean) (optional, default: false): Indicates if the search results should include aggregations.
   *
   * Description:
   * The `get` method is a static method that performs a search operation using Elasticsearch. It takes in three
   * parameters, the name of the index to search, the search parameters, and an optional boolean indicating if the
   * search results should include aggregations.
   *
   * Operations:
   * 1. Constructs the search body, setting the `index` property to `indexName` and the `body` property to `params`.
   * 2. Calls the `search` method from the `ESHelpers.esClient` object, passing the search body as an argument.
   * 3. If the `aggs` parameter is set to `true`, returns an object with properties `code`, `data`, and `total`, where
   * `code` is set to 0, `data` is set to the `aggregations` property from the search results, and `total` is set to
   * the total number of hits from the search results.
   * 4. If the `aggs` parameter is set to `false`, returns an object with properties `code`, `data`, and `total`, where
   * `code` is set to 0, `data` is set to an array of objects containing the `_source` and `_id` properties from each
   * hit in the search results, and `total` is set to the total number of hits from the search results.
   * 5. If the search operation fails, returns an object with properties `code` and `message`, where `code` is set to
   * 400 and `message` is set to the error message.
   *
   * Dependencies:
   * The code assumes that the `ESHelpers` object has been imported and is available in the current scope, and that it
   * contains an `esClient` object, which provides the `search` method for performing searches with Elasticsearch.
   */
  public static get = async (indexName: string, params: any, aggs = false) => {
    let searchBody: any = {
      index: indexName,
      body: params
    }
    return ESHelpers.esClient.search(searchBody).then(
      (data: any) => {
        if (aggs) {
          return {
            code: 0,
            data: data.aggregations,
            total: data.hits.total.value || 0
          }
        } else {
          return {
            code: 0,
            data: data.hits.hits.map((doc: any) => {
              return {
                ...doc._source,
                id: doc._id
              }
            }),
            total: data.hits.total.value || 0
          }
        }
      },
      (err: any) => {
        return {
          code: 400,
          message: err
        }
      }
    )
  }

  /**
   * Method: getById
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName (string): The name of the index to search.
   * - id (string): The id of the document to retrieve.
   *
   * Description:
   * The `getById` method is a static method that retrieves a single document from an Elasticsearch index. It takes in
   * two parameters, the name of the index to search and the id of the document to retrieve.
   *
   * Operations:
   * 1. Constructs the search parameters, setting the `query` property to an object with a `term` property, which in
   * turn has a `_id` property set to the `id` parameter.
   * 2. Calls the `get` method from the `ESHelpers` class, passing `indexName` and the constructed search parameters as
   * arguments.
   * 3. Returns the result of the `get` method.
   *
   * Dependencies:
   * The code assumes that the `ESHelpers` class has been imported and is available in the current scope, and that it
   * contains a `get` method, which performs a search with Elasticsearch.
   */
  public static getById = async (indexName: string, id: string) => {
    let params = {
      query: {
        term: {
          _id: id
        }
      }
    }

    return ESHelpers.get(indexName, params)
  }

  /**
   * Method: add
   *
   * Type: Static Method
   *
   * Parameters:
   * - req (NewRequest): The incoming request object.
   * - indexName (string): The name of the index to add the document to.
   * - item (any, optional): The document to add. If not provided, `req.body` is used instead.
   *
   * Description:
   * The `add` method is a static method that adds a document to an Elasticsearch index. It takes in three parameters:
   * an incoming request object, the name of the index to add the document to, and the document to add (optional).
   *
   * Operations:
   * 1. Sets the `item` parameter to `req.body` if `item` is not provided.
   * 2. Gets the user information from the `req` object and sets the `created` property of the `item` object to an
   * object with two properties:
   *    - `createdBy`: an object with two properties, `id` and `displayName`, taken from the user information.
   *    - `createdAt`: a timestamp set to the current time.
   * 3. Calls the `index` method of the Elasticsearch client and passes in an object with the following properties:
   *    - `index`: the name of the index to add the document to (`indexName`).
   *    - `refresh`: set to `true` to refresh the index immediately after the add operation.
   *    - `body`: the document to add (`item`).
   * 4. Returns an object with two properties:
   *    - `code`: set to `0` on success, or `400` on failure.
   *    - `data`: the result of the Elasticsearch add operation on success, or an error message on failure.
   *
   * Dependencies:
   * The code assumes that the Elasticsearch client has been imported and is available as `ESHelpers.esClient`, and
   * that the incoming request object has a `user` property with information about the user who made the request.
   */
  public static add = async (req: NewRequest, indexName: string, item?: any) => {
    item = item || req.body
    const user = req?.user
    item.created = {
      createdBy: {
        id: user?.id,
        displayName: user?.displayName
      },
      createdAt: Date.now()
    }

    return await ESHelpers.esClient
      .index({
        index: indexName,
        refresh: true,
        body: item
      })
      .then(
        (result: any) => {
          return {
            code: 0,
            data: result.body
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
  }

  /**
   * Method: addDirectly
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName: string
   * - item?: any
   *
   * Description:
   * This method is used to add a new document directly to the specified Elasticsearch index. It takes the index name
   * and item (document) as inputs and returns a result object indicating success or failure.
   *
   * Operations:
   * - Calls the `index` method of the Elasticsearch client and passes in the index name and the document to be added.
   * - Returns an object with a `code` property indicating success (0) or failure (400) and a `data` or `message`
   * property containing the result or error information.
   *
   * Dependencies:
   * - `ESHelpers.esClient`: An instance of an Elasticsearch client used to perform the operations.
   */
  public static addDirectly = async (indexName: string, item?: any) => {
    return await ESHelpers.esClient
      .index({
        index: indexName,
        refresh: true,
        body: item
      })
      .then(
        (result: any) => {
          return {
            code: 0,
            data: result.body
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
  }

  /**
   * Method: bulkAddNotExistItems
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName: string
   * - items: string[]
   * - type: string
   *
   * Description:
   * This static method is used to bulk add new items to an Elasticsearch index only if they do not already exist.
   *
   * Operations:
   * The method takes in `indexName`, `items`, and `type` as parameters. It creates an array `body` to store the data
   * that will be added to the Elasticsearch index. For each item in the `items` array, it pushes an update request and
   * a document to the `body` array. The update request specifies the index and id of the item to be updated, while the
   * document contains the `type` and `createdAt` fields with the specified type and the current date and time.
   *
   * If the `body` array has elements, it calls the bulk method of the Elasticsearch client, passing in the `body`
   * array and the options `refresh: true`. If the bulk operation is successful, the method returns an object with code
   * 0 and the data returned by the bulk operation. If there is an error, the method returns an object with code 400
   * and the error message.
   *
   * If the `body` array is empty, the method returns an object with code 0 and an empty data array.
   *
   * Dependencies:
   * The method uses the Elasticsearch client instance stored in the ESHelpers object to perform the bulk operation.
   */
  public static bulkAddNotExistItems = async (indexName: string, items: string[], type: string) => {
    let body: any[] = []

    items.map((item: string) => {
      body.push({
        update: {
          _index: indexName,
          _id: item
        }
      })
      body.push({
        doc: {
          type,
          createdAt: Date.now()
        },
        doc_as_upsert: true
      })
    })

    if (body.length) {
      return ESHelpers.esClient.bulk({ refresh: true, body }).then(
        (data: any) => {
          return {
            code: 0,
            data: data
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
    } else {
      return {
        code: 0,
        data: []
      }
    }
  }

  /**
   * Method: bulkUpdate
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName: string, The name of the index in Elasticsearch to update.
   * - items: Array<any>, The items to update in the Elasticsearch index.
   *
   * Description:
   * The `bulkUpdate` method is a static method that updates a list of items in the Elasticsearch index with the
   * specified `indexName`. The method takes in an array of items, and each item will be updated based on its `id`. If
   * there are no items to update, it returns an object with an empty data array and a code of 0.
   *
   * Operations:
   * The method first creates an array `operations` that consists of the operations required to update each item in the
   * Elasticsearch index. Then, it calls the `bulk` method from the `ESHelpers.esClient` object to perform the updates.
   * The refresh property is set to `true` to ensure that the updates are immediately available for search.
   *
   * Dependencies:
   * The method depends on the `ESHelpers.esClient` object, which is a client for connecting to an Elasticsearch
   * cluster, and the `omit` utility function from the Lodash library to exclude the `id` property from the item being
   * updated.
   */
  public static bulkUpdate = async (indexName: string, items: Array<any>) => {
    const operations = items.flatMap((item) => [
      {
        update: {
          _id: item.id,
          _index: indexName
        }
      },
      { doc: omit(item, ['id']) }
    ])

    if (operations.length) {
      return ESHelpers.esClient
        .bulk({
          refresh: true,
          body: operations
        })
        .then(
          (data: any) => {
            return {
              code: 0,
              data: data
            }
          },
          (err: any) => {
            return {
              code: 400,
              message: err
            }
          }
        )
    } else {
      return {
        code: 0,
        data: []
      }
    }
  }

  /**
   * Method: update
   *
   * Type: Static Method
   *
   * Parameters:
   * - req: NewRequest
   * - indexName: string
   * - item?: any
   *
   * Description:
   * The method updates an item in Elasticsearch based on the passed index name and item data. It takes a `req` object
   * that should contain user information and the `item` to be updated. If no item is passed, the method will try to
   * get it from the request body. The method returns an object that indicates the success or failure of the update
   * operation and the updated item data.
   *
   * Operations:
   * 1. Retrieve the user information from the `req` object.
   * 2. Get the item ID and delete it from the item data.
   * 3. Add updated information (updatedBy and updatedAt) to the item data.
   * 4. Use the Elasticsearch client's update method to update the item in the specified index.
   * 5. Return an object indicating the success or failure of the update operation and the updated item data.
   *
   * Dependencies:
   * - `ESHelpers.esClient`: The Elasticsearch client used to perform the update operation.
   * - `omit`: A utility function to remove a specific property from an object.
   */
  public static update = async (req: NewRequest, indexName: string, item?: any) => {
    item = item || req.body
    const user = req?.user || {}
    let id = item._id || item.id
    delete item._id
    item.updated = {
      updatedBy: {
        uid: user.uid,
        displayName: user.displayName
      },
      updatedAt: Date.now()
    }

    return ESHelpers.esClient
      .update({
        index: indexName,
        type: '_doc',
        id: id,
        refresh: true,
        body: {
          doc: item
        }
      })
      .then(
        () => {
          return {
            code: 0,
            data: item
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
  }

  /**
   * Method: deleteById
   *
   * Type: Static Method
   *
   * Parameters:
   * - indexName: string - The name of the index in Elasticsearch where the document is stored.
   * - id: string - The id of the document to delete.
   *
   * Description:
   * This method is used to delete a document from an Elasticsearch index by its id.
   *
   * Operations:
   * - The method takes the `indexName` and `id` as input parameters.
   * - It calls the `delete` method on the `esClient` object from the `ESHelpers` class and passes the `index`, `type`,
   * `refresh`, and `id` properties.
   * - The `delete` method returns a Promise that resolves with an object containing the code and data of the
   * operation. If the operation is successful, the code is 0 and the data is the data returned from the delete
   * operation. If the operation fails, the code is 400 and the message is the error message returned from the delete
   * operation.
   *
   * Dependencies:
   * - This method depends on the `ESHelpers` class, which should contain an `esClient` object for communicating with
   * Elasticsearch.
   */
  public static deleteById = (indexName: string, id: string) => {
    return ESHelpers.esClient
      .delete({
        index: indexName,
        type: '_doc',
        refresh: true,
        id
      })
      .then(
        (data: any) => {
          return {
            code: 0,
            data: data
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
  }

  /**
   * Method: deleteByQuery
   *
   * Type: Public Static Method
   *
   * Parameters:
   * - indexName: string
   * - query?: any
   *
   * Description:
   * This method deletes the documents in Elasticsearch matching the query provided. If the query is not provided, it
   * will delete all documents in the specified index.
   *
   * Operations:
   * 1. Deletes the documents in Elasticsearch matching the query provided.
   * 2. Returns an object containing the code and data, where code is set to 0 on success and 400 on failure.
   *
   * Dependencies:
   * This method is dependent on the `deleteByQuery` method of the Elasticsearch client, which is made available
   * through the `ESHelpers.esClient` object.
   */
  public static deleteByQuery = (indexName: string, query?: any) => {
    return ESHelpers.esClient
      .deleteByQuery({
        index: indexName,
        refresh: true,
        body: query
      })
      .then(
        (data: any) => {
          return {
            code: 0,
            data: data
          }
        },
        (err: any) => {
          return {
            code: 400,
            message: err
          }
        }
      )
  }
}
