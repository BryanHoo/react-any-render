import { cloneDeep } from 'lodash'
import { AnyObject } from '../../types'
import { getExpressionData } from '../../utils'
import { FormSchemaItem, FormSchemaObject } from '../types'

const PARSE_FIELDS: (keyof FormSchemaItem)[] = ['visible', 'name', 'required', 'readOnly', 'widget']

export const schema2RootSchema = (schema: FormSchemaObject, data: AnyObject = {}) => {
  if (!schema || !schema?.children?.length) return
  let newSchema = cloneDeep(schema)
  const { children, ...rootParams } = newSchema
  const orderChildren: (FormSchemaItem & { order: number })[] = []
  const otherChildren: FormSchemaItem[] = []
  children?.forEach((item: any) => {
    // 表达式解析
    PARSE_FIELDS.forEach(key => {
      if (item[key] && typeof item[key] === 'string') {
        item[key] = getExpressionData(item[key] as string, data)
      }
    })
    if (item?.order) {
      orderChildren.push({ ...item, order: item?.order })
    } else {
      otherChildren.push(item)
    }
  })
  const sortChildren = orderChildren.sort((a, b) => a.order - b.order)
  return {
    ...rootParams,
    children: [...sortChildren, ...otherChildren],
  }
}

/**
 * 处理bind，返回最终的数据结果
 */
export function rootData2SubmitData(rootData?: AnyObject, rootSchema?: FormSchemaObject) {
  const data: AnyObject = {}
  rootSchema?.children?.forEach(item => {
    const value = rootData?.[item.key]
    if (item?.binds?.length && value?.length) {
      item.binds.forEach((key, index) => {
        const val: any = value[index] ?? undefined
        if (val) {
          data[key] = val
        }
      })
    } else {
      if (value) {
        data[item.key] = value
      }
    }
  })
  return data
}
