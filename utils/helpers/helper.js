function fillTemplate( template, values )
{
    return template.replace(/\$\{(.*?)\}/g, (_, key) => values[key] || '');
}

module.exports = {
    fillTemplate,
};