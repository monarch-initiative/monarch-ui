/* eslint-disable */

console.log('my-markdown-loader');

const marked = require('marked');
const loaderUtils = require('loader-utils')

const markdownImageReferencesRE = /(!\[[^\]]*\]\((?!(?:https?:)?\/\/)[^)'"]+(?:\s+["'][^"']*["'])?\))/g
const imagePathRE = /^(!\[[^\]]*\]\()((?!(?:https?:)?\/\/)[^)"']+)(\s+["'][^"']*["'])?(\))$/

// converts the image path in the markdowned-image syntax into a require statement, or stringify the given content
function parseImageReference(markdownImageReference) {
  const [, mdImageStart, mdImagePath, optionalMdTitle, mdImageEnd ] = imagePathRE.exec(markdownImageReference) || []
  if (!mdImagePath) {
    return JSON.stringify(markdownImageReference)
  } else {
    // const imageRequest = loaderUtils.stringifyRequest(
    //   this,
    //   loaderUtils.urlToRequest(mdImagePath)
    const imageRequest = mdImagePath;

    const mdImageTitleAndEnd = optionalMdTitle ?
      optionalMdTitle + mdImageEnd : mdImageEnd;

    // return `${JSON.stringify(mdImageStart)} + require(${imageRequest}) + ${mdImageTitleAndEnd}`
    return [mdImageStart, imageRequest, mdImageTitleAndEnd];
  }
}

// exports the MarkdownImageLoader loader function
module.exports = function MarkdownImageLoader(markdownContent = '') {
  // the outputs of this loader can be cached
  this.cacheable && this.cacheable()

  const splitElements = markdownContent.split(markdownImageReferencesRE);
  // console.log('splitElements');
  // console.log(splitElements);
  // console.log('requirifiedElements');
  // console.log(requirifiedElements);

  let imageRequires = [];
  let placeholderedLines = [];
  splitElements.forEach((e, index) => {
    if (index % 2 === 0) {
      placeholderedLines.push(e);
    }
    else {
      const imageURLElements = parseImageReference(e);
      // console.log('   imageURLElements');
      // console.log(imageURLElements);
      imageRequires.push(imageURLElements);
      const placeholderImageRef = `${imageURLElements[0]}REQUIRIFYBEGIN${imageURLElements[1]}REQUIRIFYEND${imageURLElements[2]}`;
      placeholderedLines.push(placeholderImageRef)
    }
  });

  // console.log('placeholderedLines');
  // console.log(placeholderedLines);

  // console.log('imageRequires');
  // console.log(imageRequires);

  const placeholderedMarkdownContent = placeholderedLines.join('');
  // console.log('placeholderedMarkdownContent');
  // console.log(placeholderedMarkdownContent);

  const placeholderedHTMLContent = marked(placeholderedMarkdownContent);
  // console.log('placeholderedHTMLContent', placeholderedHTMLContent);

  const placeholderRE = /REQUIRIFYBEGIN(.+)REQUIRIFYEND/g;

  const placeholderedHTMLElements = placeholderedHTMLContent.split(placeholderRE);
  // console.log('placeholderedHTMLElements', placeholderedHTMLElements);

  let requirifiedHTMLElements = [];
  placeholderedHTMLElements.forEach((e, index) => {
    if (index % 2 === 0) {
      requirifiedHTMLElements.push(JSON.stringify(e));
    }
    else {
      const imageRequest = loaderUtils.stringifyRequest(
        this,
        loaderUtils.urlToRequest(e));

      requirifiedHTMLElements.push(`require(${imageRequest})`);
    }
  });

  // console.log('requirifiedHTMLElements', requirifiedHTMLElements);

  const result = `
module.exports = [
${requirifiedHTMLElements.join(',\n')}
].join('');
`
;

  // console.log('\n\n\nmy-markdown-loader\n\n\n');
  // console.log(markdownContent);
  // console.log(result);
  // console.log('\n\n\n');

  return result;
}

// exports function and regexp helpers for testability purposes
module.exports.helpers = {
  markdownImageReferencesRE,
  imagePathRE,
  parseImageReference
}

