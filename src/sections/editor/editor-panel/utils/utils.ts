
export const idAttribs: any = {
    id: {
        parseHTML: (element: any) => element.getAttribute("id"),
        renderHTML: (attributes: any) => {
            if (!attributes.id) return {};
            return {
                id: attributes.id,
            };
        },
    }
} 