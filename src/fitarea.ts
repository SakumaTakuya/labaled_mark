function fit(element : HTMLElement) : void {
    element.style.height = element.style.lineHeight;

    const fitHeight = element.scrollHeight;
    const windowHeight = element.parentElement?.clientHeight ||
                         document.documentElement.clientHeight;

    element.style.height = Math.max(fitHeight, windowHeight) + "px";
}

const targets = document.getElementsByClassName("fit_textarea");

for (let i = 0; i < targets.length; i++) {
    const element = targets[i] as HTMLTextAreaElement;

    if (element != null) {
        window.addEventListener('resize', _ => { fit(element); });
        element.addEventListener('input', _ => { fit(element); });
    }
}