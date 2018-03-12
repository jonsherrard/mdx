const visit = require('unist-util-visit')

const IMPORT_REGEX = /^import/
const EXPORT_REGEX = /^export/
const isImport = text => IMPORT_REGEX.test(text)
const isExport = text => EXPORT_REGEX.test(text)

const modules = tree => {
  return visit(tree, 'paragraph', (node, _i, parent) => {
    // `import` must be defined at the top level to be a real import
    if(parent.type !== 'root') {
      return node
    }

    // Paragraphs only have text in 1 node
    if(node.children.length !== 1) {
      return node
    }

    // Get the text from the text node
    const {value} = node.children[0]

    // Sets type to `import` in the AST if it's an import
    if(isImport(value)) {
      node.type = 'import'
      node.value = value
      delete node.children
      return node
    }

    if(isExport(value)) {
      node.type = 'export'
      node.value = value
      delete node.children
      return node
    }

    return node
  })
}
  

// turns `html` nodes into `jsx` nodes
const jsx = tree => visit(tree, 'html', node => node.type = 'jsx')

module.exports = options => tree => {
  modules(tree)
  jsx(tree)

  return tree
}