let callback = () => {};

function containsAOSNode(nodes) {
	let i;
	let currentNode;
	let result;

	for (i = 0; i < nodes.length; i += 1) {
		currentNode = nodes[i];

		if (currentNode.dataset?.aos) {
			return true;
		}

		result = currentNode.children && containsAOSNode(currentNode.children);

		if (result) {
			return true;
		}
	}

	return false;
}

function check(mutations) {
	if (!mutations) return;

	mutations.forEach((mutation) => {
		const addedNodes = Array.prototype.slice.call(mutation.addedNodes);
		const removedNodes = Array.prototype.slice.call(mutation.removedNodes);
		const allNodes = addedNodes.concat(removedNodes);

		if (containsAOSNode(allNodes)) {
			return callback();
		}
	});
}

function getMutationObserver() {
	return window.MutationObserver;
}

function isSupported() {
	return !!getMutationObserver();
}

function ready(selector, fn) {
	const doc = window.document;
	const MutationObserver = getMutationObserver();

	const observer = new MutationObserver(check);
	callback = fn;

	observer.observe(doc.documentElement, {
		childList: true,
		subtree: true,
	});
}

export default { isSupported, ready };
