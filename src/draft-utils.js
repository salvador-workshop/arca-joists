const fittedSize2d = (size, fitGap) => {
    return [
        size[0] + (fitGap * 2),
        size[1] + (fitGap * 2)
    ]
}

const fittedSize = (size, fitGap) => {
    const fSize2d = fittedSize2d(size, fitGap)
    return [
        fSize2d[0],
        fSize2d[1],
        size[2] + (fitGap * 2),
    ]
}

export const draftUtils = {
    fittedSize2d,
    fittedSize,
}
