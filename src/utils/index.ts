
// generate id for new nodes
export const id = {
  initialValue: 0,
  generateNewId: function() { 
    return `node-${this.initialValue++}`
  }
}