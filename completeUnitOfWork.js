function completeUnitOfWork(currentFiber) {
    let returFiber = currentFiber.return
    if (returFiber) {
        if (!returFiber.firstEffect) {
            returFiber.firstEffect = currentFiber.firstEffect
        }

        if (currentFiber.lastEffect) {
            if (returFiber.lastEffect) {
                returFiber.lastEffect.nextEffect = currentFiber.lastEffect
            }
            returFiber.lastEffect = currentFiber.lastEffect
        }
        if (currentFiber.effectTag) {
            if (returFiber) {
                if (returFiber.lastEffect) {
                    returFiber.lastEffect.nextEffect = currentFiber
                } else {
                    returFiber.firstEffect = currentFiber
                }
                returFiber.lastEffect = currentFiber
            }
        }
    }
}