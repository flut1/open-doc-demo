const path = require('path')
const fs = require('fs-extra');
const Mustache = require('mustache');
const babel = require('@babel/core')
const {html:beautifyHtml} = require('js-beautify');
const React = require('react')
const {renderToStaticMarkup} = require('react-dom/server')
const mdx = require('@mdx-js/mdx')
const {MDXProvider, mdx: createElement} = require('@mdx-js/react')

const transform = code =>
  babel.transform(code, {
    plugins: [
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-proposal-object-rest-spread'
    ]
  }).code

const renderWithReact = async mdxCode => {
  const jsx = await mdx(mdxCode, {skipExport: true})
  const code = transform(jsx)
  const scope = {mdx: createElement}
  const fn = new Function(
    'React',
    ...Object.keys(scope),
    `${code}; return React.createElement(MDXContent)`
  )
  const element = fn(React, ...Object.values(scope))
  const components = {
  }
  const elementWithProvider = React.createElement(
    MDXProvider,
    {components},
    element
  )
  return renderToStaticMarkup(elementWithProvider)
}

(async () => {
  const srcRoot = path.join(__dirname, '../src/');
  const outputRoot = path.join(__dirname, '../pages');
  const staticRoot = path.join(__dirname, '../static');

  const main = await fs.readFile(path.join(srcRoot, 'main.mdx'), { encoding: 'utf8' });

  const content = await renderWithReact(main);
  const template = await fs.readFile(path.join(srcRoot, 'template.html.mustache'), { encoding: 'utf8' });
  const html = Mustache.render(template, { content });
  await fs.emptyDir(outputRoot);
  await fs.copy(staticRoot, outputRoot);
  await fs.writeFile(path.join(outputRoot, 'index.html'), beautifyHtml(html), { encoding: 'utf8' });
})();
