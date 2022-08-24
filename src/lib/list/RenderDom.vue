<script functional>
export default {
  name: 'RenderDom',
  props: {
    render: {
      type: Function,
      render: () => {}
    }
  },
  render(h) {
    return this.render(h, this.$attrs)
  }
}
</script>
